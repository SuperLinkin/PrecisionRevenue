import { Switch, Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import KnowledgeCenter from "@/pages/knowledge-center";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Contracts from "@/pages/contracts";
import Revenue from "@/pages/revenue";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import { useAuth } from "@/lib/auth";
import { Suspense, lazy, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/lib/animations";
import { HelpButton } from "@/components/ui/help-button";
import { GuidanceWizard } from "@/components/ui/guidance-wizard";
import { useGuidance } from "@/hooks/use-guidance";

// Protected route component
const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  
  return <Component {...rest} />;
};

function App() {
  const [location] = useLocation();
  const { 
    isOpen, 
    steps, 
    closeGuidance, 
    markGuidanceAsCompleted, 
    currentMode,
    hasCompletedGuidance,
    openGuidance
  } = useGuidance();

  // Check if we should show the welcome guidance on first visit
  useEffect(() => {
    const isFirstVisit = !hasCompletedGuidance('welcome');
    
    // Only show welcome guidance on the home page, not on login/signup
    if (isFirstVisit && location === '/') {
      // Delay showing the guidance to let the page load first
      const timer = setTimeout(() => {
        openGuidance('welcome');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [location, hasCompletedGuidance, openGuidance]);

  const handleGuidanceComplete = () => {
    if (currentMode) {
      markGuidanceAsCompleted(currentMode);
    }
  };

  // Define appropriate CSS selectors for each page
  useEffect(() => {
    // Add the appropriate CSS classes to elements for guidance targeting
    const addCssClasses = () => {
      // Add navigation class
      const navElement = document.querySelector('nav');
      if (navElement) navElement.classList.add('main-navigation');
      
      // Add dashboard class
      const dashboardElement = document.querySelector('.dashboard-stats, .dashboard-overview');
      if (dashboardElement) dashboardElement.classList.add('dashboard-overview');
      
      // Add REMY assistant class
      const remyElement = document.querySelector('.remy-container, .chat-assistant');
      if (remyElement) remyElement.classList.add('remy-assistant');
      
      // Add user account class
      const userAccountElement = document.querySelector('.user-menu, .profile-section');
      if (userAccountElement) userAccountElement.classList.add('user-account');
    };
    
    // Run after a short delay to ensure DOM is ready
    setTimeout(addCssClasses, 500);
  }, [location]);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
    </div>}>
      <AnimatePresence mode="wait">
        <PageTransition key={location}>
          <Switch>
            {/* Public Routes */}
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/knowledge-center" component={KnowledgeCenter} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            
            {/* Protected Routes */}
            <Route path="/dashboard">
              {(params) => <ProtectedRoute component={Dashboard} />}
            </Route>
            <Route path="/contracts">
              {(params) => <ProtectedRoute component={Contracts} />}
            </Route>
            <Route path="/revenue">
              {(params) => <ProtectedRoute component={Revenue} />}
            </Route>
            <Route path="/reports">
              {(params) => <ProtectedRoute component={Reports} />}
            </Route>
            <Route path="/settings">
              {(params) => <ProtectedRoute component={Settings} />}
            </Route>
            
            {/* Fallback to 404 */}
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </AnimatePresence>

      {/* Help Button & Guidance Wizard */}
      <HelpButton />
      <GuidanceWizard 
        steps={steps}
        isOpen={isOpen}
        onClose={closeGuidance}
        onComplete={handleGuidanceComplete}
      />
    </Suspense>
  );
}

export default App;
