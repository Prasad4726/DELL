import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { scaleIn } from '../../animations/motionVariants';
import './AddExpense.css';

const AddExpense = ({ participants, onAdd }) => {
    const [selectedParticipant, setSelectedParticipant] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedParticipant && amount && parseFloat(amount) > 0) {
            onAdd(selectedParticipant, parseFloat(amount));
            setSelectedParticipant('');
            setAmount('');
        }
    };

    if (participants.length === 0) {
        return (
            <p className="empty-message">Add participants first to record expenses.</p>
        );
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="add-form"
            initial="hidden"
            animate="visible"
            variants={scaleIn}
        >
            <div className="select-wrapper">
                <select
                    value={selectedParticipant}
                    onChange={(e) => setSelectedParticipant(e.target.value)}
                    required
                    className="select-field"
                >
                    <option value="">Select who paid</option>
                    {participants.map((participant) => (
                        <option key={participant._id} value={participant._id}>
                            {participant.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="amount-input">
                <span className="currency-symbol">₹</span>
                <Input
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                />
            </div>

            <Button type="submit" fullWidth>
                Add Expense
            </Button>
        </motion.form>
    );
};

export default AddExpense;
