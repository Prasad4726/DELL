import express from 'express';
import {
    getConversations,
    getConversation,
    updateConversation,
    deleteConversation,
    getStats,
} from '../controllers/conversation.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.get('/', protect, getConversations);
router.get('/stats', protect, getStats);
router.get('/:id', protect, getConversation);
router.patch('/:id', protect, updateConversation);
router.delete('/:id', protect, deleteConversation);

export default router;
