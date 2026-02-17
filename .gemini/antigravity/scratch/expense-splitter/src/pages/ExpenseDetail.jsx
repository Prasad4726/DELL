import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import ExpenseItem from '../components/ExpenseItem';
import './ExpenseDetail.css';

const ExpenseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expense, setExpense] = useState(null);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('expenseHistory') || '[]');
        const found = history.find(item => item.id === parseInt(id));
        setExpense(found);
    }, [id]);

    if (!expense) {
        return (
            <div className="expense-detail-page">
                <div className="container">
                    <motion.div
                        className="not-found"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h2>Expense Not Found</h2>
                        <Button onClick={() => navigate('/history')} icon="←">
                            Back to History
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="expense-detail-page">
            <div className="container">
                <motion.div
                    className="detail-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button
                        onClick={() => navigate('/history')}
                        variant="secondary"
                        icon="←"
                    >
                        Back to History
                    </Button>
                    <h1 className="detail-title">Expense Details</h1>
                    <p className="detail-date">{formatDate(expense.date)}</p>
                </motion.div>

                <div className="detail-grid">
                    {/* Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card title="Summary" className="summary-card">
                            <div className="summary-stats">
                                <div className="stat-item">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-content">
                                        <div className="stat-label">Total Expense</div>
                                        <div className="stat-value total">₹{expense.totalExpense.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-content">
                                        <div className="stat-label">Participants</div>
                                        <div className="stat-value">{expense.participants}</div>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon">📊</div>
                                    <div className="stat-content">
                                        <div className="stat-label">Per Person</div>
                                        <div className="stat-value share">
                                            ₹{(expense.totalExpense / expense.participants).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="participants-section">
                                <h4 className="section-title">Participants</h4>
                                <div className="participants-badges">
                                    {expense.participantNames.map((name, index) => (
                                        <motion.span
                                            key={index}
                                            className="participant-badge"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
                                        >
                                            {name}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Expenses Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card title="Expenses" subtitle={`${expense.expenses.length} total expenses`}>
                            <div className="expenses-list">
                                {expense.expenses.map((exp, index) => (
                                    <ExpenseItem
                                        key={index}
                                        participant={exp.participant}
                                        amount={exp.amount}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Settlements Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card
                            title="Settlement Breakdown"
                            subtitle="How to settle up"
                            className="settlements-card"
                        >
                            {expense.settlements.length > 0 ? (
                                <div className="settlements-list">
                                    {expense.settlements.map((settlement, index) => (
                                        <motion.div
                                            key={index}
                                            className="settlement-row"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: 0.4 + (index * 0.1),
                                                ease: 'easeOut'
                                            }}
                                        >
                                            <div className="settlement-flow">
                                                <span className="settlement-from">{settlement.from}</span>
                                                <span className="settlement-arrow">→</span>
                                                <span className="settlement-to">{settlement.to}</span>
                                            </div>
                                            <span className="settlement-amount">₹{settlement.amount.toFixed(2)}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    className="no-settlements"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="no-settlements-icon">✨</div>
                                    <p>All settled! Everyone paid their fair share.</p>
                                </motion.div>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseDetail;
