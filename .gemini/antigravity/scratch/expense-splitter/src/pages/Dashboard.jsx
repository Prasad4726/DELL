import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ParticipantChip from '../components/ParticipantChip';
import ExpenseItem from '../components/ExpenseItem';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [participantName, setParticipantName] = useState('');
    const [participants, setParticipants] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [results, setResults] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const handleAddParticipant = () => {
        if (participantName.trim() && !participants.includes(participantName.trim())) {
            setParticipants([...participants, participantName.trim()]);
            setParticipantName('');
        }
    };

    const handleRemoveParticipant = (name) => {
        setParticipants(participants.filter(p => p !== name));
        setExpenses(expenses.filter(e => e.participant !== name));
        setShowResults(false);
    };

    const handleAddExpense = () => {
        if (selectedParticipant && expenseAmount && parseFloat(expenseAmount) > 0) {
            setExpenses([...expenses, {
                participant: selectedParticipant,
                amount: parseFloat(expenseAmount)
            }]);
            setSelectedParticipant('');
            setExpenseAmount('');
            setShowResults(false);
        }
    };

    const handleRemoveExpense = (index) => {
        setExpenses(expenses.filter((_, i) => i !== index));
        setShowResults(false);
    };

    const calculateSplit = () => {
        if (participants.length === 0 || expenses.length === 0) return;

        const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const perPersonShare = totalExpense / participants.length;

        // Calculate how much each person paid
        const paid = {};
        participants.forEach(p => paid[p] = 0);
        expenses.forEach(exp => {
            paid[exp.participant] = (paid[exp.participant] || 0) + exp.amount;
        });

        // Calculate settlements
        const settlements = [];
        const balances = {};

        participants.forEach(p => {
            balances[p] = paid[p] - perPersonShare;
        });

        // Create settlement transactions
        const debtors = Object.entries(balances)
            .filter(([_, balance]) => balance < 0)
            .map(([name, balance]) => ({ name, amount: -balance }))
            .sort((a, b) => b.amount - a.amount);

        const creditors = Object.entries(balances)
            .filter(([_, balance]) => balance > 0)
            .map(([name, balance]) => ({ name, amount: balance }))
            .sort((a, b) => b.amount - a.amount);

        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];
            const amount = Math.min(debtor.amount, creditor.amount);

            if (amount > 0.01) {
                settlements.push({
                    from: debtor.name,
                    to: creditor.name,
                    amount: amount
                });
            }

            debtor.amount -= amount;
            creditor.amount -= amount;

            if (debtor.amount < 0.01) i++;
            if (creditor.amount < 0.01) j++;
        }

        setResults({
            totalExpense,
            perPersonShare,
            settlements,
            participants: participants.length
        });
        setShowResults(true);

        // Save to history
        const history = JSON.parse(localStorage.getItem('expenseHistory') || '[]');
        history.unshift({
            id: Date.now(),
            date: new Date().toISOString(),
            totalExpense,
            participants: participants.length,
            participantNames: participants,
            expenses: [...expenses],
            settlements
        });
        localStorage.setItem('expenseHistory', JSON.stringify(history.slice(0, 20)));
    };

    return (
        <div className="dashboard">
            <div className="container">
                <Header />

                <div className="dashboard-grid">
                    {/* Add Participants Card */}
                    <Card
                        title="Add Participants"
                        subtitle="Who's splitting the bill?"
                        delay={0.1}
                    >
                        <div className="add-participant-form">
                            <Input
                                label="Participant Name"
                                value={participantName}
                                onChange={(e) => setParticipantName(e.target.value)}
                                placeholder="Enter name"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
                            />
                            <Button
                                onClick={handleAddParticipant}
                                fullWidth
                                icon="➕"
                            >
                                Add Participant
                            </Button>
                        </div>

                        {participants.length > 0 && (
                            <motion.div
                                className="participants-list"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                            >
                                <AnimatePresence>
                                    {participants.map((name, index) => (
                                        <ParticipantChip
                                            key={name}
                                            name={name}
                                            index={index}
                                            onRemove={() => handleRemoveParticipant(name)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </Card>

                    {/* Add Expense Card */}
                    <Card
                        title="Add Expenses"
                        subtitle="Track who paid what"
                        delay={0.2}
                    >
                        <div className="add-expense-form">
                            <div className="form-group">
                                <label className="form-label">Select Participant</label>
                                <select
                                    className="form-select"
                                    value={selectedParticipant}
                                    onChange={(e) => setSelectedParticipant(e.target.value)}
                                    disabled={participants.length === 0}
                                >
                                    <option value="">Choose participant...</option>
                                    {participants.map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label="Amount"
                                type="number"
                                prefix="₹"
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                                placeholder="0.00"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddExpense()}
                            />

                            <Button
                                onClick={handleAddExpense}
                                fullWidth
                                icon="💰"
                                disabled={!selectedParticipant || !expenseAmount}
                            >
                                Add Expense
                            </Button>
                        </div>

                        {expenses.length > 0 && (
                            <motion.div
                                className="expenses-list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h4 className="list-title">Expenses</h4>
                                <AnimatePresence>
                                    {expenses.map((expense, index) => (
                                        <ExpenseItem
                                            key={index}
                                            participant={expense.participant}
                                            amount={expense.amount}
                                            index={index}
                                            onRemove={() => handleRemoveExpense(index)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </Card>

                    {/* Calculate Button */}
                    {participants.length > 0 && expenses.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <Button
                                onClick={calculateSplit}
                                size="large"
                                fullWidth
                                icon="🧮"
                            >
                                Calculate Split
                            </Button>
                        </motion.div>
                    )}

                    {/* Results Card */}
                    <AnimatePresence>
                        {showResults && results && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                                <Card
                                    title="Settlement Summary"
                                    subtitle="Here's how to settle up"
                                    hover={false}
                                    className="results-card"
                                >
                                    <div className="results-summary">
                                        <div className="summary-item">
                                            <span className="summary-label">Total Expense</span>
                                            <span className="summary-value total">₹{results.totalExpense.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="summary-label">Per Person Share</span>
                                            <span className="summary-value share">₹{results.perPersonShare.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {results.settlements.length > 0 && (
                                        <div className="settlements">
                                            <h4 className="settlements-title">Who Owes Whom</h4>
                                            {results.settlements.map((settlement, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="settlement-item"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: 0.1 + (index * 0.1),
                                                        ease: 'easeOut'
                                                    }}
                                                >
                                                    <span className="settlement-from">{settlement.from}</span>
                                                    <span className="settlement-arrow">→</span>
                                                    <span className="settlement-to">{settlement.to}</span>
                                                    <span className="settlement-amount">₹{settlement.amount.toFixed(2)}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {results.settlements.length === 0 && (
                                        <motion.div
                                            className="no-settlements"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <p>✨ All settled! Everyone paid their fair share.</p>
                                        </motion.div>
                                    )}
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* View History Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="history-button-container"
                    >
                        <Button
                            onClick={() => navigate('/history')}
                            variant="secondary"
                            fullWidth
                            icon="📜"
                        >
                            View History
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
