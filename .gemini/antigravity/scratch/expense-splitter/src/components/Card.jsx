import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
    children,
    title,
    subtitle,
    delay = 0,
    hover = true,
    className = '',
    ...props
}) => {
    return (
        <motion.div
            className={`card ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: 'easeOut'
            }}
            whileHover={hover ? {
                y: -4,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            } : {}}
            {...props}
        >
            {(title || subtitle) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
            )}
            <div className="card-content">
                {children}
            </div>
        </motion.div>
    );
};

export default Card;
