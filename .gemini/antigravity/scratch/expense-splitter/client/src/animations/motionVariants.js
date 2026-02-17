// Page load stagger animation
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

// Fade in from bottom
export const fadeInUp = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

// Slide in from right
export const slideInRight = {
    hidden: {
        opacity: 0,
        x: 30
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

// Scale in animation
export const scaleIn = {
    hidden: {
        opacity: 0,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

// List item animation
export const listItemVariants = {
    hidden: {
        opacity: 0,
        y: 10
    },
    visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.05,
            duration: 0.3,
            ease: "easeOut"
        }
    })
};

// Card hover animation
export const cardHover = {
    rest: {
        scale: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    },
    hover: {
        scale: 1.02,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        transition: {
            duration: 0.2,
            ease: "easeInOut"
        }
    }
};

// Button tap animation
export const buttonTap = {
    scale: 0.95,
    transition: {
        duration: 0.1
    }
};

// Results reveal animation
export const resultsReveal = {
    hidden: {
        opacity: 0,
        height: 0,
        marginTop: 0
    },
    visible: {
        opacity: 1,
        height: "auto",
        marginTop: "2rem",
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

// Sequential fade in for result items
export const resultItemVariants = {
    hidden: {
        opacity: 0,
        x: -10
    },
    visible: (index) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: index * 0.1,
            duration: 0.3,
            ease: "easeOut"
        }
    })
};
