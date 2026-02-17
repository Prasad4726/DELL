import express from 'express';
import { receiveMessage, receiveStatus } from '../controllers/webhook.controller.js';

const router = express.Router();

// Public routes - called by Twilio
router.post('/whatsapp', receiveMessage);
router.post('/status', receiveStatus);

export default router;
