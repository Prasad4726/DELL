import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/motionVariants';
import './Header.css';

const Header = () => {
    return (
        <motion.header
            className="header"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
        >
            <div className="header-content">
                <motion.div
                    className="header-icon"
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                    }}
                >
                    💰
                </motion.div>
                <h1 className="header-title">Expense Splitter</h1>
                <p className="header-subtitle">Split bills easily with friends</p>
            </div>
        </motion.header>
    );
};

export default Header;
