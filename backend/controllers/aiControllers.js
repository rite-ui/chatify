import Message from '../models/message.model.js'
import Conversation from '../models/conversation.model.js';

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

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: `You are a helpful AI assistant in a chat application called ChatApp. 
          Be concise, friendly, and helpful. Format responses with markdown when appropriate.
          Current user: ${req.user.username}`,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'AI request failed');
    }

    const aiResponse = data.content[0]?.text || 'No response generated.';

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
          model: 'claude-3-haiku-20240307',
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

// @POST /api/ai/summarize
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

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `Summarize this conversation in 3-5 bullet points:\n\n${transcript}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const summary = data.content[0]?.text || 'Could not generate summary.';

    res.status(200).json({ success: true, summary });
  } catch (error) {
    next(error);
  }
};

// @POST /api/ai/suggest-reply
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

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: `Based on this conversation, suggest 3 short reply options for ${req.user.username}. Return only a JSON array of strings.\n\n${recentMessages}`,
          },
        ],
      }),
    });

    const data = await response.json();
    let suggestions = [];

    try {
      const text = data.content[0]?.text || '[]';
      suggestions = JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      suggestions = ['Sounds good!', 'I agree!', 'Thanks for letting me know.'];
    }

    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
};
