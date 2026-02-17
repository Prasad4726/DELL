import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { sendTextMessage, sendMediaMessage } from '../services/whatsapp.service.js';
import { emitNewMessage, emitConversationUpdate } from '../services/socket.service.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and documents are allowed.'));
        }
    },
});

/**
 * @route   POST /api/messages/send
 * @desc    Send message to customer via WhatsApp
 * @access  Private
 */
export const sendMessage = async (req, res, next) => {
    try {
        const { conversationId, body, mediaUrl } = req.body;

        if (!conversationId || (!body && !mediaUrl)) {
            return res.status(400).json({
                success: false,
                message: 'Conversation ID and message body or media URL required',
            });
        }

        // Find conversation
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found',
            });
        }

        const customerPhone = conversation.customerPhone;
        let twilioResponse;

        // Send via Twilio
        if (mediaUrl) {
            twilioResponse = await sendMediaMessage(customerPhone, mediaUrl, body);
        } else {
            twilioResponse = await sendTextMessage(customerPhone, body);
        }

        // Save message to database
        const message = await Message.create({
            conversationId,
            from: process.env.TWILIO_WHATSAPP_NUMBER.replace('whatsapp:', ''),
            to: customerPhone,
            body: body || '',
            direction: 'outbound',
            messageType: mediaUrl ? 'image' : 'text',
            mediaUrl: mediaUrl || null,
            twilioSid: twilioResponse.messageSid,
            status: twilioResponse.status,
        });

        // Update conversation
        conversation.lastMessage = body || '[Media]';
        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Emit real-time events
        emitNewMessage(conversationId, message);
        emitConversationUpdate(conversation);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            data: message,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/messages/:conversationId
 * @desc    Get messages for a conversation
 * @access  Private
 */
export const getMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Verify conversation exists
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found',
            });
        }

        // Get messages with pagination
        const messages = await Message.find({ conversationId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Message.countDocuments({ conversationId });

        res.status(200).json({
            success: true,
            data: messages.reverse(), // Return in chronological order
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/messages/upload
 * @desc    Upload media file
 * @access  Private
 */
export const uploadMedia = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        // In production, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
        // For now, return local file path
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            data: {
                filename: req.file.filename,
                url: fileUrl,
                mimetype: req.file.mimetype,
                size: req.file.size,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PATCH /api/messages/:messageId/read
 * @desc    Mark message as read
 * @access  Private
 */
export const markAsRead = async (req, res, next) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findByIdAndUpdate(
            messageId,
            { status: 'read' },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found',
            });
        }

        res.status(200).json({
            success: true,
            data: message,
        });
    } catch (error) {
        next(error);
    }
};

export default { sendMessage, getMessages, uploadMedia, markAsRead, upload };
