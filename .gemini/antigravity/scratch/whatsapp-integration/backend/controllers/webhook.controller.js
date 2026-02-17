import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { parseIncomingMessage } from '../services/whatsapp.service.js';
import { emitNewMessage, emitConversationUpdate } from '../services/socket.service.js';

/**
 * @route   POST /api/webhook/whatsapp
 * @desc    Receive incoming WhatsApp messages from Twilio
 * @access  Public (called by Twilio)
 */
export const receiveMessage = async (req, res) => {
    try {
        console.log('📨 Incoming WhatsApp message:', req.body);

        // Parse Twilio webhook payload
        const messageData = parseIncomingMessage(req.body);
        const { from, to, body, twilioSid, direction, messageType, mediaUrl, formData } = messageData;

        // Find or create conversation
        let conversation = await Conversation.findOne({ customerPhone: from });

        if (!conversation) {
            // New conversation - create it
            conversation = await Conversation.create({
                customerPhone: from,
                customerName: req.body.ProfileName || 'Unknown Customer',
                status: 'active',
                lastMessage: body,
                lastMessageAt: new Date(),
                unreadCount: 1,
            });

            console.log('✅ New conversation created:', conversation._id);
        } else {
            // Update existing conversation
            conversation.lastMessage = body || '[Media]';
            conversation.lastMessageAt = new Date();
            conversation.unreadCount += 1;
            await conversation.save();
        }

        // Save message to database
        const message = await Message.create({
            conversationId: conversation._id,
            from,
            to,
            body,
            direction,
            messageType,
            mediaUrl,
            formData,
            twilioSid,
            status: 'delivered',
        });

        console.log('✅ Message saved:', message._id);

        // Emit real-time events
        emitNewMessage(conversation._id.toString(), message);
        emitConversationUpdate(conversation);

        // Respond to Twilio (required to acknowledge webhook)
        res.status(200).send('');
    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        // Still respond with 200 to prevent Twilio retries
        res.status(200).send('');
    }
};

/**
 * @route   POST /api/webhook/status
 * @desc    Receive message status updates from Twilio
 * @access  Public (called by Twilio)
 */
export const receiveStatus = async (req, res) => {
    try {
        const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = req.body;

        console.log(`📊 Status update for ${MessageSid}: ${MessageStatus}`);

        // Find and update message
        const message = await Message.findOne({ twilioSid: MessageSid });

        if (message) {
            message.status = MessageStatus;
            if (ErrorCode) {
                message.errorCode = ErrorCode;
                message.errorMessage = ErrorMessage;
            }
            await message.save();

            // Emit status update via Socket.IO
            const { emitMessageStatus } = await import('../services/socket.service.js');
            emitMessageStatus(message.conversationId.toString(), message._id.toString(), MessageStatus);
        }

        res.status(200).send('');
    } catch (error) {
        console.error('❌ Error processing status webhook:', error);
        res.status(200).send('');
    }
};

export default { receiveMessage, receiveStatus };
