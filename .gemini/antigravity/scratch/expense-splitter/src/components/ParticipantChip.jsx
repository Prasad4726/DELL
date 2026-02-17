import { motion } from 'framer-motion';
import './ParticipantChip.css';

const ParticipantChip = ({ name, onRemove, index = 0 }) => {
    return (
        <motion.div
            className="participant-chip"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: 'easeOut'
            }}
        >
            <span className="participant-name">{name}</span>
            <motion.button
                className="participant-remove"
                onClick={onRemove}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                aria-label={`Remove ${name}`}
            >
                ×
            </motion.button>
        </motion.div>
    );
};

export default ParticipantChip;
