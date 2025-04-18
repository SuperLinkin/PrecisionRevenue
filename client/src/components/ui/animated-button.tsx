import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  hoverEffect?: "scale" | "lift" | "glow" | "none";
}

export function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  icon,
  iconPosition = "left",
  hoverEffect = "scale",
  ...props
}: AnimatedButtonProps) {
  // Different hover animations based on the effect type
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case "scale":
        return {
          scale: 1.03,
          transition: { duration: 0.2 }
        };
      case "lift":
        return {
          y: -3,
          boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
          transition: { duration: 0.2 }
        };
      case "glow":
        return {
          boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
          transition: { duration: 0.2 }
        };
      case "none":
      default:
        return {};
    }
  };

  return (
    <motion.div
      whileHover={getHoverAnimation()}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        className={className}
        variant={variant as any}
        size={size}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <motion.span
            className="mr-2"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.2 }}
        >
          {children}
        </motion.span>
        {icon && iconPosition === "right" && (
          <motion.span
            className="ml-2"
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
      </Button>
    </motion.div>
  );
}