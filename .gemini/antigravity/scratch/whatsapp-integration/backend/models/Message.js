import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true,
    },
    from: {
        type: String,
        required: true,
        trim: true,
    },
    to: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        default: '',
    },
    direction: {
        type: String,
        enum: ['inbound', 'outbound'],
        required: true,
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'document', 'form', 'audio', 'video'],
        default: 'text',
    },
    mediaUrl: {
        type: String,
        default: null,
    },
    formData: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read', 'failed', 'queued'],
        default: 'sent',
    },
    twilioSid: {
        type: String,
        default: null,
        index: true,
    },
    errorCode: {
        type: String,
        default: null,
    },
    errorMessage: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});

// Indexes for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ twilioSid: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
