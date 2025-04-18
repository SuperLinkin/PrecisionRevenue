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
import Settings from "@/pages/settings";
import ClausPage from "@/pages/claus";
import MocaPage from "@/pages/moca";
import DisclosurePage from "@/pages/disclosure";
import AnalyticsPage from "@/pages/analytics";
import DealDeskPage from "@/pages/deal-desk";
import CompanyPage from "@/pages/company";
import { useAuth } from "@/lib/auth";
import { Suspense, lazy, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/lib/animations";

// For demo purposes, all routes are accessible without login
const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  // In a real application, this would check authentication
  // For MVP demo, we'll always allow access
  return <Component {...rest} />;
};

function App() {
  const [location] = useLocation();

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
            <Route path="/claus">
              {(params) => <ProtectedRoute component={ClausPage} />}
            </Route>
            <Route path="/moca">
              {(params) => <ProtectedRoute component={MocaPage} />}
            </Route>
            <Route path="/disclosure">
              {(params) => <ProtectedRoute component={DisclosurePage} />}
            </Route>
            <Route path="/analytics">
              {(params) => <ProtectedRoute component={AnalyticsPage} />}
            </Route>
            <Route path="/deal-desk">
              {(params) => <ProtectedRoute component={DealDeskPage} />}
            </Route>
            <Route path="/company">
              {(params) => <ProtectedRoute component={CompanyPage} />}
            </Route>
            <Route path="/settings">
              {(params) => <ProtectedRoute component={Settings} />}
            </Route>
            
            {/* Fallback to 404 */}
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </AnimatePresence>

      {/* Help Button & Guidance Wizard removed as requested */}
    </Suspense>
  );
}

export default App;
