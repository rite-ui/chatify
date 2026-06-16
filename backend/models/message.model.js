import mongoose from "mongoose";
const reactionSchema = new mongoose.Schema({
    emoji: {type: String, required: true},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});
const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
             ref: 'Conversation', 
             required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
             ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: [true, 'Message content is required'],
            trim: true,
            maxlength: [1000, 'Message content must be less than 1000 characters long']
        },
        type: {
            type: String,
            enum: ['text', 'image', 'file','ai', 'system'],
            default: 'text'
        },
        reactions: [reactionSchema],
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
             ref: 'Message',
             default: null
        },
        isEdited: {
            type: Boolean,
            default: false
        },
        isDeleted: { type: Boolean, default: false },
        readBy: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                readAt: { type: Date, default: Date.now },
            },
        ],
        aiMetadata: {
            prompt: String,
            model: String,
        },
    },
    {timestamps: true}
);
messageSchema.index({ conversation: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;