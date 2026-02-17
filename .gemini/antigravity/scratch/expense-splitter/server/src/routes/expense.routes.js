import express from 'express';
import {
    getAllExpenses,
    addExpense,
    deleteExpense,
    deleteAllExpenses
} from '../controllers/expense.controller.js';

const router = express.Router();

router.route('/')
    .get(getAllExpenses)
    .post(addExpense)
    .delete(deleteAllExpenses);

router.route('/:id')
    .delete(deleteExpense);

export default router;
