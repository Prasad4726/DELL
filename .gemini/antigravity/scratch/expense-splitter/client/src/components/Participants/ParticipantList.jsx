import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listItemVariants } from '../../animations/motionVariants';
import './ParticipantList.css';

const ParticipantList = ({ participants }) => {
    if (participants.length === 0) {
        return (
            <p className="empty-message">No participants yet. Add some to get started!</p>
        );
    }

    return (
        <div className="participant-list">
            <AnimatePresence>
                {participants.map((participant, index) => (
                    <motion.div
                        key={participant._id}
                        className="participant-item"
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20 }}
                        variants={listItemVariants}
                        whileHover={{
                            scale: 1.02,
                            backgroundColor: 'var(--primary-50)'
                        }}
                    >
                        <span className="participant-icon">👤</span>
                        <span className="participant-name">{participant.name}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ParticipantList;
