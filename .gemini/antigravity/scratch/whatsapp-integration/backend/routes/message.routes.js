import express from 'express';
import {
    sendMessage,
    getMessages,
    uploadMedia,
    markAsRead,
    upload,
} from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.post('/send', protect, sendMessage);
router.get('/:conversationId', protect, getMessages);
router.post('/upload', protect, upload.single('file'), uploadMedia);
router.patch('/:messageId/read', protect, markAsRead);

export default router;
