import { useState } from 'react';
import { motion } from 'framer-motion';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    prefix,
    required = false,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.toString().length > 0;

    return (
        <div className="input-wrapper">
            <motion.div
                className={`input-container ${isFocused ? 'focused' : ''} ${hasValue ? 'has-value' : ''}`}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
            >
                {prefix && <span className="input-prefix">{prefix}</span>}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="input-field"
                    placeholder={placeholder}
                    required={required}
                    {...props}
                />
                {label && (
                    <motion.label
                        className="input-label"
                        initial={false}
                        animate={{
                            top: isFocused || hasValue ? '-10px' : '50%',
                            fontSize: isFocused || hasValue ? 'var(--font-size-xs)' : 'var(--font-size-base)',
                            color: isFocused ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {label}
                        {required && <span className="input-required">*</span>}
                    </motion.label>
                )}
            </motion.div>
        </div>
    );
};

export default Input;
