import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { scaleIn } from '../../animations/motionVariants';

const AddParticipant = ({ onAdd }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim());
            setName('');
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="add-form"
            initial="hidden"
            animate="visible"
            variants={scaleIn}
        >
            <Input
                label="Enter name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Virat"
                required
            />
            <Button type="submit" fullWidth>
                Add Participant
            </Button>
        </motion.form>
    );
};

export default AddParticipant;
