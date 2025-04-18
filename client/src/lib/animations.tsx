import { motion, AnimatePresence, Variants } from "framer-motion";
import React, { ReactNode } from "react";

// Common animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.3 } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.2 } 
  }
};

export const slideInFromRight: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      duration: 0.3
    } 
  },
  exit: { 
    x: 20, 
    opacity: 0, 
    transition: { duration: 0.2 } 
  }
};

export const slideInFromLeft: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      duration: 0.3
    } 
  },
  exit: { 
    x: -20, 
    opacity: 0, 
    transition: { duration: 0.2 } 
  }
};

export const slideInFromBottom: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      duration: 0.3
    } 
  },
  exit: { 
    y: 20, 
    opacity: 0, 
    transition: { duration: 0.2 } 
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      duration: 0.4
    } 
  },
  exit: { 
    scale: 0.9, 
    opacity: 0, 
    transition: { duration: 0.2 } 
  }
};

// Animation container component
interface AnimatedContainerProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ 
  children, 
  variants = fadeIn, 
  className = "", 
  delay = 0 
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation
export const staggeredContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggeredItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

// Page transition wrapper
export const PageTransition: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Hover animation for cards and interactive elements
export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
};

// Button click animation
export const buttonClick = {
  whileTap: { scale: 0.95 }
};

// Focus animation for input fields
export const focusAnimation: Variants = {
  rest: { scale: 1 },
  focus: { scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }
};

// List item appear animation
export const listItemAnimation: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  }),
};