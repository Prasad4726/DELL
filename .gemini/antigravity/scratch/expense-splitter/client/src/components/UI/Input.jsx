import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
    min,
    step
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.toString().length > 0;

    return (
        <div className="input-wrapper">
            <motion.input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                required={required}
                min={min}
                step={step}
                className="input-field"
                whileFocus={{
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                    borderColor: 'var(--primary-500)'
                }}
            />
            {label && (
                <label className={`input-label ${isFocused || hasValue ? 'active' : ''}`}>
                    {label}
                </label>
            )}
        </div>
    );
};

export default Input;
