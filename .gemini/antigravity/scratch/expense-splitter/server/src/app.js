import express from 'express';
import cors from 'cors';
import participantRoutes from './routes/participant.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import resultRoutes from './routes/result.routes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/participants', participantRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/results', resultRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
