import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  element?: string; // CSS selector for the element to highlight
  position?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface GuidanceWizardProps {
  steps: GuidanceStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  startAtStep?: number;
}

export function GuidanceWizard({
  steps,
  isOpen,
  onClose,
  onComplete,
  startAtStep = 0,
}: GuidanceWizardProps) {
  const [currentStep, setCurrentStep] = useState(startAtStep);
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);
  const isMobile = useIsMobile();

  const step = steps[currentStep];

  useEffect(() => {
    if (isOpen && step?.element) {
      const updatePosition = () => {
        const el = document.querySelector(step.element as string);
        if (el) {
          const rect = el.getBoundingClientRect();
          setTargetElement(rect);
        } else {
          setTargetElement(null);
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    } else {
      setTargetElement(null);
    }
  }, [isOpen, currentStep, step?.element]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete?.();
    onClose();
    setCurrentStep(0);
  };

  if (!isOpen || !step) return null;

  const calculatePosition = () => {
    if (!targetElement || !step.position || step.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const margin = 16; // Margin from the target element
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let top: string, left: string, transform: string;

    switch (step.position) {
      case 'top':
        top = `${targetElement.top - margin}px`;
        left = `${targetElement.left + targetElement.width / 2}px`;
        transform = 'translate(-50%, -100%)';
        break;
      case 'right':
        top = `${targetElement.top + targetElement.height / 2}px`;
        left = `${targetElement.right + margin}px`;
        transform = 'translateY(-50%)';
        break;
      case 'bottom':
        top = `${targetElement.bottom + margin}px`;
        left = `${targetElement.left + targetElement.width / 2}px`;
        transform = 'translateX(-50%)';
        break;
      case 'left':
        top = `${targetElement.top + targetElement.height / 2}px`;
        left = `${targetElement.left - margin}px`;
        transform = 'translate(-100%, -50%)';
        break;
      default:
        top = '50%';
        left = '50%';
        transform = 'translate(-50%, -50%)';
    }

    // Adjust if the tooltip goes beyond the window bounds
    const tooltipWidth = 320; // Approximate tooltip width
    const tooltipHeight = 180; // Approximate tooltip height

    // Calculate tooltip boundaries based on position and transform
    let tooltipLeft: number = 0;
    let tooltipTop: number = 0;

    // Convert string px values to numbers for calculation
    if (typeof left === 'string' && left.endsWith('px')) {
      tooltipLeft = parseFloat(left);
    }
    if (typeof top === 'string' && top.endsWith('px')) {
      tooltipTop = parseFloat(top);
    }

    // Adjust horizontal position if needed
    if (step.position === 'top' || step.position === 'bottom') {
      const leftEdge = tooltipLeft - tooltipWidth / 2;
      const rightEdge = tooltipLeft + tooltipWidth / 2;

      if (leftEdge < margin) {
        left = `${margin + tooltipWidth / 2}px`;
      } else if (rightEdge > windowWidth - margin) {
        left = `${windowWidth - margin - tooltipWidth / 2}px`;
      }
    }

    // Adjust vertical position if needed
    if (step.position === 'left' || step.position === 'right') {
      const topEdge = tooltipTop - tooltipHeight / 2;
      const bottomEdge = tooltipTop + tooltipHeight / 2;

      if (topEdge < margin) {
        top = `${margin + tooltipHeight / 2}px`;
      } else if (bottomEdge > windowHeight - margin) {
        top = `${windowHeight - margin - tooltipHeight / 2}px`;
      }
    }

    return { top, left, transform };
  };

  const tooltipPosition = calculatePosition();

  // Force centered position on mobile
  const position = isMobile
    ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    : tooltipPosition;

  // Add overlay/highlight for the target element
  const renderHighlight = () => {
    if (!targetElement) return null;

    return (
      <div
        className="absolute bg-primary/20 border-2 border-primary/50 rounded-md pointer-events-none z-10"
        style={{
          top: targetElement.top + window.scrollY,
          left: targetElement.left + window.scrollX,
          width: targetElement.width,
          height: targetElement.height,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
        }}
      />
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Target highlight */}
          {renderHighlight()}

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed z-50 p-4 bg-white rounded-lg shadow-xl w-full max-w-sm"
            style={position}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">{step.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-gray-600 mb-4">{step.description}</p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <span
                    key={index}
                    className={`block h-1.5 rounded-full ${
                      index === currentStep
                        ? 'w-6 bg-primary'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}

                {step.action ? (
                  <Button
                    size="sm"
                    className="flex items-center"
                    onClick={() => {
                      step.action?.onClick();
                      handleNext();
                    }}
                  >
                    {step.action.label}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="flex items-center"
                    onClick={handleNext}
                  >
                    {currentStep < steps.length - 1 ? (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Finish
                        <CheckCircle2 className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}