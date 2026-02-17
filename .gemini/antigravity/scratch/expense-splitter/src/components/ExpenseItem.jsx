import { motion } from 'framer-motion';
import './ExpenseItem.css';

const ExpenseItem = ({ participant, amount, index = 0, onRemove }) => {
    return (
        <motion.div
            className="expense-item"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: 'easeOut'
            }}
        >
            <div className="expense-info">
                <span className="expense-participant">{participant}</span>
                <span className="expense-amount">₹{amount.toFixed(2)}</span>
            </div>
            {onRemove && (
                <motion.button
                    className="expense-remove"
                    onClick={onRemove}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    aria-label={`Remove expense for ${participant}`}
                >
                    🗑️
                </motion.button>
            )}
        </motion.div>
    );
};

export default ExpenseItem;
