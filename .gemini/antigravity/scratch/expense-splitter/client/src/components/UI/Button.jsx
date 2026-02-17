import React from 'react';
import { motion } from 'framer-motion';
import { buttonTap } from '../../animations/motionVariants';
import './Button.css';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    type = 'button',
    disabled = false,
    fullWidth = false
}) => {
    return (
        <motion.button
            className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
            whileTap={!disabled ? buttonTap : {}}
            whileHover={!disabled ? { scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' } : {}}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.button>
    );
};

export default Button;
