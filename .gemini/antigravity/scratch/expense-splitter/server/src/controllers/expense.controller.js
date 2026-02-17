import Expense from '../models/expense.model.js';

// Get all expenses
export const getAllExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find()
            .populate('participant', 'name')
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        next(error);
    }
};

// Add a new expense
export const addExpense = async (req, res, next) => {
    try {
        const { participant, amount } = req.body;

        if (!participant) {
            return res.status(400).json({
                success: false,
                error: 'Participant is required'
            });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Valid amount is required'
            });
        }

        const expense = await Expense.create({ participant, amount });
        const populatedExpense = await Expense.findById(expense._id).populate('participant', 'name');

        res.status(201).json({
            success: true,
            data: populatedExpense
        });
    } catch (error) {
        next(error);
    }
};

// Delete an expense
export const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                error: 'Expense not found'
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

// Delete all expenses
export const deleteAllExpenses = async (req, res, next) => {
    try {
        await Expense.deleteMany({});
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
