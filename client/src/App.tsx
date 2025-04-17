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
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import { useAuth } from "@/lib/auth";
import { Suspense, lazy } from "react";

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
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
    </div>}>
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
    </Suspense>
  );
}

export default App;
