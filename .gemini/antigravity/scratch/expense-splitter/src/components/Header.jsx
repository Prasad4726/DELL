import { motion } from 'framer-motion';
import './Header.css';

const Header = () => {
    return (
        <motion.header
            className="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="header-content">
                <motion.div
                    className="header-icon"
                    animate={{
                        rotate: [0, 10, -10, 10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: 'easeInOut'
                    }}
                >
                    💰
                </motion.div>
                <h1 className="header-title">Expense Splitter</h1>
            </div>
            <p className="header-subtitle">Split bills fairly and effortlessly</p>
        </motion.header>
    );
};

export default Header;
