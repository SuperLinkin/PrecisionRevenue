import React, { createContext, useState, useContext, useEffect } from 'react';
import { GuidanceStep } from '@/components/ui/guidance-wizard';

type GuidanceMode = 'welcome' | 'revenue' | 'contracts' | 'dealDesk' | 'reports' | 'custom';

interface GuidanceContextType {
  isOpen: boolean;
  currentMode: GuidanceMode | null;
  steps: GuidanceStep[];
  openGuidance: (mode: GuidanceMode, customSteps?: GuidanceStep[]) => void;
  closeGuidance: () => void;
  showGuidanceButton: boolean;
  toggleGuidanceButton: (show: boolean) => void;
  hasCompletedGuidance: (mode: GuidanceMode) => boolean;
  markGuidanceAsCompleted: (mode: GuidanceMode) => void;
}

const GuidanceContext = createContext<GuidanceContextType | undefined>(undefined);

const STORAGE_KEY = 'pra_completed_guidance';

// Define welcome tour steps
const welcomeSteps: GuidanceStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PRA',
    description: 'Let\'s take a quick tour of Precision Revenue Automation to help you get started with the platform.',
    position: 'center',
  },
  {
    id: 'navigation',
    title: 'Navigation',
    description: 'Use the main menu to access different modules like Revenue, Contracts, Deal Desk, and Reports.',
    element: '.main-navigation',
    position: 'right',
  },
  {
    id: 'dashboard',
    title: 'Executive Dashboard',
    description: 'This is your NOVA dashboard with key metrics and insights at a glance.',
    element: '.dashboard-overview',
    position: 'bottom',
  },
  {
    id: 'remy',
    title: 'Meet REMY',
    description: 'Your Revenue Management Assistant is here to help. Ask questions about contracts, revenue rules, or use drag & drop for contract analysis.',
    element: '.remy-assistant',
    position: 'left',
  },
  {
    id: 'account',
    title: 'Your Account',
    description: 'Access your profile, settings, and notifications from the account menu.',
    element: '.user-account',
    position: 'bottom',
  },
  {
    id: 'help',
    title: 'Need Help?',
    description: 'You can access this guide anytime by clicking the help button in the bottom right corner.',
    element: '.help-button',
    position: 'top',
  },
];

// Define revenue module steps
const revenueSteps: GuidanceStep[] = [
  {
    id: 'revenue-intro',
    title: 'Revenue Recognition',
    description: 'This module helps you track, recognize, and forecast revenue in compliance with accounting standards.',
    position: 'center',
  },
  {
    id: 'moca-integration',
    title: 'MOCA Intelligence',
    description: 'Our forecasting engine analyzes historical data and contract terms to predict future revenue patterns.',
    element: '.moca-section',
    position: 'bottom',
  },
  {
    id: 'revenue-charts',
    title: 'Interactive Charts',
    description: 'Explore recognized vs. scheduled revenue with these interactive visualizations.',
    element: '.revenue-charts',
    position: 'top',
  },
  {
    id: 'revenue-actions',
    title: 'Quick Actions',
    description: 'Use these tools to generate reports, adjust forecasts, or review pending recognition events.',
    element: '.revenue-actions',
    position: 'left',
  },
];

// Define contracts module steps
const contractsSteps: GuidanceStep[] = [
  {
    id: 'contracts-intro',
    title: 'Contract Management',
    description: 'Review, analyze, and manage your contracts and their revenue components.',
    position: 'center',
  },
  {
    id: 'claus-integration',
    title: 'CLAUS Analysis',
    description: 'Our contract language analysis utility automatically identifies performance obligations and financing components.',
    element: '.claus-section',
    position: 'bottom',
  },
  {
    id: 'contract-list',
    title: 'Contract List',
    description: 'View all your contracts with important metadata like status, value, and compliance alerts.',
    element: '.contracts-list',
    position: 'right',
  },
  {
    id: 'upload-contract',
    title: 'Upload Contracts',
    description: 'You can upload new contracts by clicking this button or simply drag and drop files.',
    element: '.upload-contract',
    position: 'top',
  },
];

// Define deal desk module steps
const dealDeskSteps: GuidanceStep[] = [
  {
    id: 'dealdesk-intro',
    title: 'Deal Desk',
    description: 'Streamline contract approvals, negotiations, and revenue impact analysis.',
    position: 'center',
  },
  {
    id: 'deal-pipeline',
    title: 'Deal Pipeline',
    description: 'Track deals at different stages from initial proposal to signed contract.',
    element: '.deal-pipeline',
    position: 'bottom',
  },
  {
    id: 'revenue-impact',
    title: 'Revenue Impact Analysis',
    description: 'See how new deals will affect your revenue recognition schedule and forecasts.',
    element: '.revenue-impact',
    position: 'left',
  },
  {
    id: 'approval-workflow',
    title: 'Approval Workflow',
    description: 'Manage the approval process with customizable workflows for different deal types.',
    element: '.approval-workflow',
    position: 'right',
  },
];

// Define reports module steps
const reportsSteps: GuidanceStep[] = [
  {
    id: 'reports-intro',
    title: 'Reports & Analytics',
    description: 'Generate detailed reports and gain insights from your revenue and contract data.',
    position: 'center',
  },
  {
    id: 'report-templates',
    title: 'Report Templates',
    description: 'Choose from various templates designed for different stakeholders and compliance needs.',
    element: '.report-templates',
    position: 'right',
  },
  {
    id: 'custom-reports',
    title: 'Custom Reports',
    description: 'Create your own reports with the metrics and visualizations that matter to you.',
    element: '.custom-reports',
    position: 'bottom',
  },
  {
    id: 'export-options',
    title: 'Export Options',
    description: 'Export your reports in various formats including PDF, Excel, and CSV.',
    element: '.export-options',
    position: 'left',
  },
];

export const GuidanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<GuidanceMode | null>(null);
  const [steps, setSteps] = useState<GuidanceStep[]>([]);
  const [showGuidanceButton, setShowGuidanceButton] = useState(true);
  const [completedGuidance, setCompletedGuidance] = useState<Record<string, boolean>>({});

  // Load completed guidance from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCompletedGuidance(parsed);
      } catch (e) {
        console.error('Failed to parse completed guidance data', e);
      }
    }
  }, []);

  const getStepsForMode = (mode: GuidanceMode): GuidanceStep[] => {
    switch (mode) {
      case 'welcome':
        return welcomeSteps;
      case 'revenue':
        return revenueSteps;
      case 'contracts':
        return contractsSteps;
      case 'dealDesk':
        return dealDeskSteps;
      case 'reports':
        return reportsSteps;
      default:
        return [];
    }
  };

  const openGuidance = (mode: GuidanceMode, customSteps?: GuidanceStep[]) => {
    const stepsToUse = mode === 'custom' && customSteps ? customSteps : getStepsForMode(mode);
    setSteps(stepsToUse);
    setCurrentMode(mode);
    setIsOpen(true);
  };

  const closeGuidance = () => {
    setIsOpen(false);
    setCurrentMode(null);
  };

  const toggleGuidanceButton = (show: boolean) => {
    setShowGuidanceButton(show);
  };

  const hasCompletedGuidance = (mode: GuidanceMode): boolean => {
    return !!completedGuidance[mode];
  };

  const markGuidanceAsCompleted = (mode: GuidanceMode) => {
    const updated = { ...completedGuidance, [mode]: true };
    setCompletedGuidance(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const value = {
    isOpen,
    currentMode,
    steps,
    openGuidance,
    closeGuidance,
    showGuidanceButton,
    toggleGuidanceButton,
    hasCompletedGuidance,
    markGuidanceAsCompleted,
  };

  return <GuidanceContext.Provider value={value}>{children}</GuidanceContext.Provider>;
};

export const useGuidance = () => {
  const context = useContext(GuidanceContext);
  if (context === undefined) {
    throw new Error('useGuidance must be used within a GuidanceProvider');
  }
  return context;
};