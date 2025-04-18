import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, X, BookOpen, Compass, FileText, 
  BarChart4, Lightbulb, MessageSquareText, BookMarked
} from 'lucide-react';
import { useGuidance } from '@/hooks/use-guidance';

interface HelpButtonProps {
  className?: string;
}

export function HelpButton({ className }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    openGuidance, 
    showGuidanceButton, 
    hasCompletedGuidance,
    markGuidanceAsCompleted 
  } = useGuidance();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (mode: any) => {
    setIsOpen(false);
    openGuidance(mode);
  };

  const handleTourComplete = () => {
    markGuidanceAsCompleted('welcome');
  };

  if (!showGuidanceButton) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-3 mb-2 w-64"
          >
            <div className="flex justify-between items-center mb-2 pb-2 border-b">
              <h3 className="font-semibold text-gray-800">Help Center</h3>
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleMenuItemClick('welcome')}
                className="w-full text-left px-3 py-2 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors"
              >
                <Compass className="mr-2 h-4 w-4 text-primary" />
                <span>Platform Tour</span>
                {hasCompletedGuidance('welcome') && (
                  <span className="ml-auto text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                    Viewed
                  </span>
                )}
              </button>
              <button
                onClick={() => handleMenuItemClick('revenue')}
                className="w-full text-left px-3 py-2 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors"
              >
                <BarChart4 className="mr-2 h-4 w-4 text-blue-600" />
                <span>Revenue Module</span>
              </button>
              <button
                onClick={() => handleMenuItemClick('contracts')}
                className="w-full text-left px-3 py-2 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors"
              >
                <FileText className="mr-2 h-4 w-4 text-indigo-600" />
                <span>Contracts Module</span>
              </button>
              <button
                onClick={() => handleMenuItemClick('dealDesk')}
                className="w-full text-left px-3 py-2 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors"
              >
                <BookMarked className="mr-2 h-4 w-4 text-purple-600" />
                <span>Deal Desk</span>
              </button>
              <button
                onClick={() => handleMenuItemClick('reports')}
                className="w-full text-left px-3 py-2 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors"
              >
                <BookOpen className="mr-2 h-4 w-4 text-emerald-600" />
                <span>Reports & Analytics</span>
              </button>
              <div className="pt-2 mt-2 border-t">
                <a 
                  href="/knowledge-center" 
                  className="w-full text-left px-3 py-2 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors"
                >
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-600" />
                  <span>Knowledge Center</span>
                </a>
                <a 
                  href="/support" 
                  className="w-full text-left px-3 py-2 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors"
                >
                  <MessageSquareText className="mr-2 h-4 w-4 text-pink-600" />
                  <span>Contact Support</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`h-14 w-14 rounded-full bg-white shadow-lg flex items-center justify-center text-primary border border-gray-200 hover:border-primary transition-colors ${
          isOpen ? 'bg-primary text-white hover:bg-primary-700' : ''
        } help-button`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        aria-label="Help"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <HelpCircle className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
}