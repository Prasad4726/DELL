import { motion } from 'framer-motion';
import './Button.css';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    icon,
    ...props
}) => {
    return (
        <motion.button
            className={`button button-${variant} button-${size} ${fullWidth ? 'button-full' : ''}`}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            {...props}
        >
            {icon && <span className="button-icon">{icon}</span>}
            <span className="button-text">{children}</span>
        </motion.button>
    );
};

export default Button;
