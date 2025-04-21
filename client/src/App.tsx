import { Switch, Route } from "wouter";
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
import SystemStatusPage from "@/pages/system-status";
import BulkUpload from "@/pages/bulk-upload";
import { useAuth } from "@/lib/auth";
import { Suspense } from "react";

// For demo purposes, all routes are accessible without login
const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  // In a real application, this would check authentication
  // For MVP demo, we'll always allow access
  return <Component {...rest} />;
};

function App() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      }
    >
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/knowledge-center" component={KnowledgeCenter} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        
        {/* Protected Routes */}
        <Route path="/dashboard">
          {() => <ProtectedRoute component={Dashboard} />}
        </Route>
        <Route path="/contracts">
          {() => <ProtectedRoute component={Contracts} />}
        </Route>
        <Route path="/revenue">
          {() => <ProtectedRoute component={Revenue} />}
        </Route>
        <Route path="/claus">
          {() => <ProtectedRoute component={ClausPage} />}
        </Route>
        <Route path="/moca">
          {() => <ProtectedRoute component={MocaPage} />}
        </Route>
        <Route path="/disclosure">
          {() => <ProtectedRoute component={DisclosurePage} />}
        </Route>
        <Route path="/analytics">
          {() => <ProtectedRoute component={AnalyticsPage} />}
        </Route>
        <Route path="/deal-desk">
          {() => <ProtectedRoute component={DealDeskPage} />}
        </Route>
        <Route path="/company">
          {() => <ProtectedRoute component={CompanyPage} />}
        </Route>
        <Route path="/settings">
          {() => <ProtectedRoute component={Settings} />}
        </Route>
        <Route path="/system-status">
          {() => <ProtectedRoute component={SystemStatusPage} />}
        </Route>
        <Route path="/bulk-upload">
          {() => <ProtectedRoute component={BulkUpload} />}
        </Route>
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default App;
