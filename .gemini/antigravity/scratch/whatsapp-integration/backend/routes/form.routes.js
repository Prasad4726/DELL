import express from 'express';
import {
    getForms,
    getForm,
    createForm,
    updateForm,
    deleteForm,
    sendForm,
} from '../controllers/form.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.get('/', protect, getForms);
router.post('/', protect, createForm);
router.get('/:id', protect, getForm);
router.put('/:id', protect, updateForm);
router.delete('/:id', protect, deleteForm);
router.post('/:id/send', protect, sendForm);

export default router;
