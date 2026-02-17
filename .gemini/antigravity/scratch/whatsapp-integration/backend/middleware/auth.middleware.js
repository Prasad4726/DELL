import jwt from 'jsonwebtoken';
import Agent from '../models/Agent.js';

export const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get agent from database
        req.agent = await Agent.findById(decoded.id).select('-password');

        if (!req.agent) {
            return res.status(401).json({
                success: false,
                message: 'Agent not found',
            });
        }

        if (!req.agent.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Agent account is deactivated',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }
};

// Middleware to check if agent is admin
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.agent.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.agent.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
