import Form from '../models/Form.js';
import { sendFormMessage } from '../services/whatsapp.service.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { emitNewMessage, emitConversationUpdate } from '../services/socket.service.js';

/**
 * @route   GET /api/forms
 * @desc    Get all forms
 * @access  Private
 */
export const getForms = async (req, res, next) => {
    try {
        const { isActive } = req.query;

        const query = {};
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const forms = await Form.find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: forms,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/forms/:id
 * @desc    Get form by ID
 * @access  Private
 */
export const getForm = async (req, res, next) => {
    try {
        const form = await Form.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found',
            });
        }

        res.status(200).json({
            success: true,
            data: form,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/forms
 * @desc    Create new form
 * @access  Private
 */
export const createForm = async (req, res, next) => {
    try {
        const { name, description, fields } = req.body;

        if (!name || !fields || fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Form name and fields are required',
            });
        }

        const form = await Form.create({
            name,
            description,
            fields,
            createdBy: req.agent.id,
        });

        res.status(201).json({
            success: true,
            message: 'Form created successfully',
            data: form,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/forms/:id
 * @desc    Update form
 * @access  Private
 */
export const updateForm = async (req, res, next) => {
    try {
        const { name, description, fields, isActive } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (fields) updateData.fields = fields;
        if (isActive !== undefined) updateData.isActive = isActive;

        const form = await Form.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Form updated successfully',
            data: form,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/forms/:id
 * @desc    Delete form
 * @access  Private
 */
export const deleteForm = async (req, res, next) => {
    try {
        const form = await Form.findByIdAndDelete(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Form deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/forms/:id/send
 * @desc    Send form to customer
 * @access  Private
 */
export const sendForm = async (req, res, next) => {
    try {
        const { conversationId } = req.body;
        const formId = req.params.id;

        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: 'Conversation ID required',
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

        // Send form via WhatsApp
        const twilioResponse = await sendFormMessage(conversation.customerPhone, formId);

        // Save message to database
        const message = await Message.create({
            conversationId,
            from: process.env.TWILIO_WHATSAPP_NUMBER.replace('whatsapp:', ''),
            to: conversation.customerPhone,
            body: `Form sent: ${twilioResponse.formName}`,
            direction: 'outbound',
            messageType: 'form',
            twilioSid: twilioResponse.messageSid,
            status: twilioResponse.status,
        });

        // Update conversation
        conversation.lastMessage = `📋 Form: ${twilioResponse.formName}`;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Emit real-time events
        emitNewMessage(conversationId, message);
        emitConversationUpdate(conversation);

        res.status(200).json({
            success: true,
            message: 'Form sent successfully',
            data: message,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getForms,
    getForm,
    createForm,
    updateForm,
    deleteForm,
    sendForm,
};
