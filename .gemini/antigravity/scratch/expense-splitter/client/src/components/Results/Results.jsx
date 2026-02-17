import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resultsReveal, resultItemVariants } from '../../animations/motionVariants';
import Card from '../UI/Card';
import './Results.css';

const Results = ({ results, show }) => {
    if (!show || !results) return null;

    const { totalExpense, perPersonShare, settlements, participantBalances } = results;

    return (
        <AnimatePresence>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={resultsReveal}
            >
                <Card hover={false} className="results-card">
                    <h2>💡 Split Results</h2>

                    <div className="results-summary">
                        <div className="summary-item">
                            <span className="summary-label">Total Expense</span>
                            <span className="summary-value total">₹{totalExpense?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Per Person Share</span>
                            <span className="summary-value share">₹{perPersonShare?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>

                    {settlements && settlements.length > 0 ? (
                        <div className="settlements">
                            <h3>Who Owes Whom</h3>
                            {settlements.map((settlement, index) => (
                                <motion.div
                                    key={index}
                                    className="settlement-item"
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    variants={resultItemVariants}
                                >
                                    <div className="settlement-from">
                                        <span className="settlement-name owes">{settlement.from}</span>
                                        <span className="settlement-text"> owes </span>
                                    </div>
                                    <div className="settlement-to">
                                        <span className="settlement-name gets">{settlement.to}</span>
                                    </div>
                                    <div className="settlement-amount owes-amount">
                                        ₹{settlement.amount.toFixed(2)}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="all-settled"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="settled-icon">✅</span>
                            <p>All settled! Everyone paid their fair share.</p>
                        </motion.div>
                    )}

                    {participantBalances && participantBalances.length > 0 && (
                        <div className="balances">
                            <h3>Individual Balances</h3>
                            {participantBalances.map((balance, index) => (
                                <motion.div
                                    key={index}
                                    className="balance-item"
                                    custom={index + (settlements?.length || 0)}
                                    initial="hidden"
                                    animate="visible"
                                    variants={resultItemVariants}
                                >
                                    <span className="balance-name">{balance.name}</span>
                                    <span className={`balance-amount ${balance.balance > 0 ? 'positive' : balance.balance < 0 ? 'negative' : 'neutral'}`}>
                                        {balance.balance > 0 ? '+' : ''}₹{balance.balance.toFixed(2)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};

export default Results;
