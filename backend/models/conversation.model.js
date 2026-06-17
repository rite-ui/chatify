import mongoose from 'mongoose';

const coversationSchema = new mongoose.model({
    participants: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
    type: {
        type:String,
        enum:['direct','group'],
        default: 'direct'
    },
    name:{
        type:String,
        trim:true,
        maxlength: [50, 'Group name cannot exceed 50 characters'],
    },
    avatar: String,
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    pinnedMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    isArchived: {type: Boolean, default: false},
    mutedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
},
{    timestamps: true,}
);
conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model('Conversation', coversationSchema);
export default Conversation;