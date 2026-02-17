import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import './History.css';

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('expenseHistory') || '[]');
        setHistory(savedHistory);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleClearHistory = () => {
        if (window.confirm('Are you sure you want to clear all history?')) {
            localStorage.removeItem('expenseHistory');
            setHistory([]);
        }
    };

    return (
        <div className="history-page">
            <div className="container">
                <motion.div
                    className="history-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="header-top">
                        <Button
                            onClick={() => navigate('/')}
                            variant="secondary"
                            icon="←"
                        >
                            Back
                        </Button>
                        {history.length > 0 && (
                            <Button
                                onClick={handleClearHistory}
                                variant="danger"
                                size="small"
                                icon="🗑️"
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                    <h1 className="history-title">Expense History</h1>
                    <p className="history-subtitle">View your past expense splits</p>
                </motion.div>

                <div className="history-grid">
                    {history.length === 0 ? (
                        <motion.div
                            className="empty-state"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="empty-icon">📊</div>
                            <h3>No History Yet</h3>
                            <p>Your expense splits will appear here</p>
                            <Button
                                onClick={() => navigate('/')}
                                icon="➕"
                            >
                                Create New Split
                            </Button>
                        </motion.div>
                    ) : (
                        history.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ y: -4 }}
                            >
                                <Card
                                    hover={true}
                                    className="history-card"
                                    onClick={() => navigate(`/expense/${item.id}`)}
                                >
                                    <div className="history-card-header">
                                        <div className="history-date">{formatDate(item.date)}</div>
                                        <div className="history-total">₹{item.totalExpense.toFixed(2)}</div>
                                    </div>
                                    <div className="history-card-body">
                                        <div className="history-info">
                                            <span className="info-icon">👥</span>
                                            <span className="info-text">{item.participants} participants</span>
                                        </div>
                                        <div className="history-info">
                                            <span className="info-icon">💰</span>
                                            <span className="info-text">{item.expenses.length} expenses</span>
                                        </div>
                                        <div className="history-info">
                                            <span className="info-icon">🔄</span>
                                            <span className="info-text">{item.settlements.length} settlements</span>
                                        </div>
                                    </div>
                                    <div className="history-participants">
                                        {item.participantNames.slice(0, 3).map((name, i) => (
                                            <span key={i} className="participant-badge">{name}</span>
                                        ))}
                                        {item.participantNames.length > 3 && (
                                            <span className="participant-badge more">
                                                +{item.participantNames.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
