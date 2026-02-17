import { calculateSplit } from '../services/calculation.service.js';

// Calculate expense split results
export const getResults = async (req, res, next) => {
    try {
        const results = await calculateSplit();

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        next(error);
    }
};
