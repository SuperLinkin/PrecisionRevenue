import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  icon: ReactNode;
}

export function FeatureCard({ title, description, features, icon }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-primary/5 backdrop-blur-sm border border-white/10 p-6 transition-all duration-300 shadow-lg">
        {/* Animated Gradient Accent */}
        <div 
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-r from-secondary/40 to-accent/40 blur-xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-40'}`}
        />
        
        {/* Shimmer Effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        />
        
        <div className="relative z-10">
          {/* Icon & Title */}
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10">
              {icon}
            </div>
            <h3 className="text-xl leading-6 font-bold text-primary/90 ml-3">{title}</h3>
          </div>
          
          {/* Description */}
          <p className="text-base text-neutral/90 mb-5">{description}</p>
          
          {/* Features List */}
          <ul className="mt-4 space-y-3">
            {features.map((feature, index) => (
              <motion.li 
                key={index} 
                className="flex items-center"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-secondary mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span className="text-sm font-medium">{feature}</span>
              </motion.li>
            ))}
          </ul>
          
          {/* Active indicator */}
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-secondary to-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: isHovered ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
