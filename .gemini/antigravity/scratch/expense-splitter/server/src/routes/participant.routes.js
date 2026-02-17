import express from 'express';
import {
    getAllParticipants,
    addParticipant,
    deleteParticipant,
    deleteAllParticipants
} from '../controllers/participant.controller.js';

const router = express.Router();

router.route('/')
    .get(getAllParticipants)
    .post(addParticipant)
    .delete(deleteAllParticipants);

router.route('/:id')
    .delete(deleteParticipant);

export default router;
