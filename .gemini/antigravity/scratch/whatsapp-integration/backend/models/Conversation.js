import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    customerPhone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    customerName: {
        type: String,
        default: 'Unknown Customer',
        trim: true,
    },
    assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        default: null,
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'closed'],
        default: 'active',
    },
    lastMessage: {
        type: String,
        default: '',
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    unreadCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Indexes for performance
conversationSchema.index({ customerPhone: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ status: 1 });
conversationSchema.index({ assignedAgent: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
