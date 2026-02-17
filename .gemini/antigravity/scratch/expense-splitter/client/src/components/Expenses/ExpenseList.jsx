import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInRight } from '../../animations/motionVariants';
import './ExpenseList.css';

const ExpenseList = ({ expenses }) => {
    if (expenses.length === 0) {
        return (
            <p className="empty-message">No expenses recorded yet.</p>
        );
    }

    return (
        <div className="expense-list">
            <AnimatePresence>
                {expenses.map((expense, index) => (
                    <motion.div
                        key={expense._id}
                        className="expense-item"
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        variants={slideInRight}
                    >
                        <div className="expense-info">
                            <span className="expense-payer">{expense.participant.name}</span>
                            <span className="expense-text"> paid</span>
                        </div>
                        <motion.div
                            className="expense-amount"
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            ₹{expense.amount.toFixed(2)}
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ExpenseList;
