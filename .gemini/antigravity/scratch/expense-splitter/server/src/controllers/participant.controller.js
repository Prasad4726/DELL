import Participant from '../models/participant.model.js';

// Get all participants
export const getAllParticipants = async (req, res, next) => {
    try {
        const participants = await Participant.find().sort({ createdAt: 1 });
        res.status(200).json({
            success: true,
            count: participants.length,
            data: participants
        });
    } catch (error) {
        next(error);
    }
};

// Add a new participant
export const addParticipant = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Participant name is required'
            });
        }

        const participant = await Participant.create({ name: name.trim() });

        res.status(201).json({
            success: true,
            data: participant
        });
    } catch (error) {
        next(error);
    }
};

// Delete a participant
export const deleteParticipant = async (req, res, next) => {
    try {
        const participant = await Participant.findByIdAndDelete(req.params.id);

        if (!participant) {
            return res.status(404).json({
                success: false,
                error: 'Participant not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// Delete all participants
export const deleteAllParticipants = async (req, res, next) => {
    try {
        await Participant.deleteMany({});
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
