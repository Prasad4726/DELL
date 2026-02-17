import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({ children, className = '', hover = true }) => {
    return (
        <motion.div
            className={`card ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={hover ? {
                y: -4,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
            } : {}}
        >
            {children}
        </motion.div>
    );
};

export default Card;
