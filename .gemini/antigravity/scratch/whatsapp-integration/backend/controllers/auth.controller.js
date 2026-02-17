import Agent from '../models/Agent.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register new agent (admin only)
 * @access  Public (should be protected in production)
 */
export const register = async (req, res, next) => {
    try {
        const { email, password, name, role } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, password, and name',
            });
        }

        // Check if agent exists
        const existingAgent = await Agent.findOne({ email });
        if (existingAgent) {
            return res.status(400).json({
                success: false,
                message: 'Agent already exists with this email',
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create agent
        const agent = await Agent.create({
            email,
            password: hashedPassword,
            name,
            role: role || 'agent',
        });

        // Generate token
        const token = generateToken(agent._id);

        res.status(201).json({
            success: true,
            message: 'Agent registered successfully',
            data: {
                id: agent._id,
                email: agent.email,
                name: agent.name,
                role: agent.role,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Agent login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Find agent and include password
        const agent = await Agent.findOne({ email }).select('+password');

        if (!agent) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if agent is active
        if (!agent.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated',
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, agent.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Update last login
        agent.lastLogin = new Date();
        await agent.save();

        // Generate token
        const token = generateToken(agent._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                id: agent._id,
                email: agent.email,
                name: agent.name,
                role: agent.role,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current agent info
 * @access  Private
 */
export const getMe = async (req, res, next) => {
    try {
        const agent = await Agent.findById(req.agent.id);

        res.status(200).json({
            success: true,
            data: agent,
        });
    } catch (error) {
        next(error);
    }
};

export default { register, login, getMe };
