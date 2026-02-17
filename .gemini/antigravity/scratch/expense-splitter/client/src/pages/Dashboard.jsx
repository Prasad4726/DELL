import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import AddParticipant from '../components/Participants/AddParticipant';
import ParticipantList from '../components/Participants/ParticipantList';
import AddExpense from '../components/Expenses/AddExpense';
import ExpenseList from '../components/Expenses/ExpenseList';
import Results from '../components/Results/Results';
import { containerVariants, fadeInUp } from '../animations/motionVariants';
import * as api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [participants, setParticipants] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [results, setResults] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [participantsRes, expensesRes] = await Promise.all([
                api.getParticipants(),
                api.getExpenses()
            ]);
            setParticipants(participantsRes.data || []);
            setExpenses(expensesRes.data || []);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load data. Make sure the server is running.');
        }
    };

    const handleAddParticipant = async (name) => {
        try {
            const response = await api.addParticipant(name);
            setParticipants([...participants, response.data]);
            setShowResults(false);
        } catch (err) {
            console.error('Error adding participant:', err);
            setError('Failed to add participant');
        }
    };

    const handleAddExpense = async (participantId, amount) => {
        try {
            const response = await api.addExpense(participantId, amount);
            setExpenses([...expenses, response.data]);
            setShowResults(false);
        } catch (err) {
            console.error('Error adding expense:', err);
            setError('Failed to add expense');
        }
    };

    const handleCalculate = async () => {
        if (participants.length === 0) {
            setError('Add participants first');
            return;
        }
        if (expenses.length === 0) {
            setError('Add expenses first');
            return;
        }

        try {
            setLoading(true);
            const response = await api.calculateResults();
            setResults(response.data);
            setShowResults(true);
            setError(null);
        } catch (err) {
            console.error('Error calculating results:', err);
            setError('Failed to calculate results');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm('Are you sure you want to reset all data?')) {
            try {
                await Promise.all([
                    api.deleteAllParticipants(),
                    api.deleteAllExpenses()
                ]);
                setParticipants([]);
                setExpenses([]);
                setResults(null);
                setShowResults(false);
                setError(null);
            } catch (err) {
                console.error('Error resetting data:', err);
                setError('Failed to reset data');
            }
        }
    };

    return (
        <div className="dashboard">
            <Header />

            <motion.div
                className="container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {error && (
                    <motion.div
                        className="error-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        ⚠️ {error}
                    </motion.div>
                )}

                <div className="dashboard-grid">
                    <motion.div variants={fadeInUp}>
                        <Card>
                            <h2>👥 Add Participants</h2>
                            <AddParticipant onAdd={handleAddParticipant} />
                            <ParticipantList participants={participants} />
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Card>
                            <h2>💸 Add Expenses</h2>
                            <AddExpense
                                participants={participants}
                                onAdd={handleAddExpense}
                            />
                            <ExpenseList expenses={expenses} />
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    className="action-buttons"
                    variants={fadeInUp}
                >
                    <Button
                        onClick={handleCalculate}
                        disabled={loading || participants.length === 0 || expenses.length === 0}
                        fullWidth
                    >
                        {loading ? 'Calculating...' : '🧮 Calculate Split'}
                    </Button>

                    {(participants.length > 0 || expenses.length > 0) && (
                        <Button
                            onClick={handleReset}
                            variant="secondary"
                            fullWidth
                        >
                            🔄 Reset All
                        </Button>
                    )}
                </motion.div>

                <Results results={results} show={showResults} />
            </motion.div>
        </div>
    );
};

export default Dashboard;
