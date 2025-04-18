import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  interactive?: boolean;
  hoverScale?: number;
  shadow?: "sm" | "md" | "lg" | "none";
  animation?: "fadeIn" | "slideUp" | "slideRight" | "scale" | "none";
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  interactive = true,
  hoverScale = 1.02,
  shadow = "md",
  animation = "fadeIn"
}: AnimatedCardProps) {
  
  // Shadow styling
  const shadowStyles = {
    none: "",
    sm: "shadow-sm hover:shadow",
    md: "shadow hover:shadow-md",
    lg: "shadow-md hover:shadow-lg",
  };
  
  // Initial animation variants
  const animationVariants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 }
    },
    none: {
      initial: {},
      animate: {}
    }
  };
  
  // Get the selected animation variant
  const selectedAnimation = animationVariants[animation];
  
  return (
    <motion.div
      className={cn(
        "rounded-xl overflow-hidden",
        interactive && "transition-all duration-300",
        shadowStyles[shadow],
        className
      )}
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0], // Smooth easing function
      }}
      whileHover={
        interactive 
          ? { 
              scale: hoverScale, 
              transition: { duration: 0.2 } 
            } 
          : {}
      }
      whileTap={
        interactive 
          ? { 
              scale: Math.max(1, hoverScale - 0.04),
              transition: { duration: 0.1 }
            } 
          : {}
      }
    >
      {children}
    </motion.div>
  );
}