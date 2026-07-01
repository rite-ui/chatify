import { GoogleGenAI } from '@google/genai';
import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';

// Gemini SDK को इनिशियलाइज़ करें
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @POST /api/ai/chat
export const aiChat = async (req, res, next) => {
  try {
    const { prompt, conversationId } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    // Verify user is in conversation
    if (conversationId) {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: req.user._id,
      });
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
    }

    // --- GEMINI API CALL ---
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // तेज़ और चैट के लिए बेस्ट मॉडल
      contents: prompt,
      config: {
        systemInstruction: `You are a helpful AI assistant in a chat application called ChatApp. 
          Be concise, friendly, and helpful. Format responses with markdown when appropriate.
          Current user: ${req.user.username}`,
        maxOutputTokens: 1024,
      },
    });

    const aiResponse = response.text || 'No response generated.';

    // Save AI message to conversation if provided
    let savedMessage = null;
    if (conversationId) {
      savedMessage = await Message.create({
        conversation: conversationId,
        sender: req.user._id,
        content: aiResponse,
        type: 'ai',
        aiMetadata: {
          prompt,
          model: 'gemini-2.5-flash',
        },
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: savedMessage._id,
        updatedAt: new Date(),
      });

      await savedMessage.populate('sender', 'username avatar');
    }

    res.status(200).json({
      success: true,
      response: aiResponse,
      message: savedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/ai/summarize/:conversationId
export const summarizeConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const messages = await Message.find({ conversation: conversationId, isDeleted: false })
      .populate('sender', 'username')
      .sort({ createdAt: -1 })
      .limit(50);

    const transcript = messages
      .reverse()
      .map((m) => `${m.sender.username}: ${m.content}`)
      .join('\n');

    // --- GEMINI SUMMARIZE CALL ---
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize this conversation in 3-5 bullet points:\n\n${transcript}`,
      config: {
        maxOutputTokens: 512,
      },
    });

    const summary = response.text || 'Could not generate summary.';

    res.status(200).json({ success: true, summary });
  } catch (error) {
    next(error);
  }
};

// @GET /api/ai/suggest-reply/:conversationId
export const suggestReply = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversation: conversationId, isDeleted: false })
      .populate('sender', 'username')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentMessages = messages
      .reverse()
      .map((m) => `${m.sender.username}: ${m.content}`)
      .join('\n');

    // --- GEMINI SUGGEST REPLY CALL WITH JSON RESPONSE ---
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on this conversation, suggest 3 short reply options for ${req.user.username}. Return only a JSON array of strings.\n\n${recentMessages}`,
      config: {
        maxOutputTokens: 256,
        // responseMimeType सुनिश्चित करता है कि जेमिनी सिर्फ वैलिड JSON ही रिटर्न करे
        responseMimeType: 'application/json',
      },
    });

    let suggestions = [];
    try {
      const text = response.text || '[]';
      suggestions = JSON.parse(text.trim());
    } catch {
      suggestions = ['Sounds good!', 'I agree!', 'Thanks for letting me know.'];
    }

    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
};