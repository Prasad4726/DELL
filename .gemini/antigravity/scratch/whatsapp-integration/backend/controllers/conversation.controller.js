import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/**
 * @route   GET /api/conversations
 * @desc    Get all conversations with filters
 * @access  Private
 */
export const getConversations = async (req, res, next) => {
    try {
        const { status, search, assignedAgent } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        if (status) {
            query.status = status;
        }

        if (assignedAgent) {
            query.assignedAgent = assignedAgent;
        }

        if (search) {
            query.$or = [
                { customerPhone: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
            ];
        }

        // Get conversations with pagination
        const conversations = await Conversation.find(query)
            .populate('assignedAgent', 'name email')
            .sort({ lastMessageAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Conversation.countDocuments(query);

        res.status(200).json({
            success: true,
            data: conversations,
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
 * @route   GET /api/conversations/:id
 * @desc    Get conversation by ID
 * @access  Private
 */
export const getConversation = async (req, res, next) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
            .populate('assignedAgent', 'name email');

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found',
            });
        }

        // Reset unread count when conversation is viewed
        if (conversation.unreadCount > 0) {
            conversation.unreadCount = 0;
            await conversation.save();
        }

        res.status(200).json({
            success: true,
            data: conversation,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PATCH /api/conversations/:id
 * @desc    Update conversation
 * @access  Private
 */
export const updateConversation = async (req, res, next) => {
    try {
        const { assignedAgent, status, tags, customerName } = req.body;

        const updateData = {};

        if (assignedAgent !== undefined) updateData.assignedAgent = assignedAgent;
        if (status) updateData.status = status;
        if (tags) updateData.tags = tags;
        if (customerName) updateData.customerName = customerName;

        const conversation = await Conversation.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('assignedAgent', 'name email');

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Conversation updated successfully',
            data: conversation,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/conversations/:id
 * @desc    Archive/delete conversation
 * @access  Private
 */
export const deleteConversation = async (req, res, next) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found',
            });
        }

        // Instead of deleting, mark as closed
        conversation.status = 'closed';
        await conversation.save();

        res.status(200).json({
            success: true,
            message: 'Conversation archived successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/conversations/stats
 * @desc    Get conversation statistics
 * @access  Private
 */
export const getStats = async (req, res, next) => {
    try {
        const totalConversations = await Conversation.countDocuments();
        const activeConversations = await Conversation.countDocuments({ status: 'active' });
        const pendingConversations = await Conversation.countDocuments({ status: 'pending' });
        const closedConversations = await Conversation.countDocuments({ status: 'closed' });
        const totalMessages = await Message.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalConversations,
                activeConversations,
                pendingConversations,
                closedConversations,
                totalMessages,
            },
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getConversations,
    getConversation,
    updateConversation,
    deleteConversation,
    getStats,
};
