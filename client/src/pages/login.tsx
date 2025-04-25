import { NavBar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use useEffect for navigation
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Remove the direct navigation
  if (isAuthenticated) {
    return null;
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      // Demo mode - automatically login with mock user
      await login(values.username, values.password);
      toast({
        title: "Login successful",
        description: "Welcome to PRA Dashboard",
        variant: "default",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-grow flex flex-col md:flex-row items-stretch bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Left side - Login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your PRA account</p>
            </div>
            
            <Card className="border-0 shadow-xl">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                          <FormControl>
                            <Input 
                              className="h-11 border-gray-300 focus:ring-2 focus:ring-secondary/20"
                              placeholder="Enter your username" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                            <a href="#" className="text-xs text-secondary hover:text-blue-600 font-medium">
                              Forgot Password?
                            </a>
                          </div>
                          <FormControl>
                            <Input 
                              className="h-11 border-gray-300 focus:ring-2 focus:ring-secondary/20"
                              type="password" 
                              placeholder="Enter your password" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              className="text-secondary rounded border-gray-300"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="remember-me"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <label
                            htmlFor="remember-me"
                            className="text-sm font-medium text-gray-700"
                          >
                            Remember me
                          </label>
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-secondary hover:bg-blue-600 text-white font-medium transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                          </div>
                        ) : "Sign in"}
                      </Button>
                    </div>
                    
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup">
                          <span className="text-secondary hover:underline cursor-pointer font-medium">
                            Sign up
                          </span>
                        </Link>
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Right side - Hero image/info */}
        <div className="hidden md:flex md:w-1/2 bg-primary p-12 flex-col justify-center items-center text-white">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">Precision Revenue Automation</h2>
            <p className="text-gray-300 mb-8">
              Streamline your revenue operations, automate contract management, and ensure compliance with 
              ASC 606/IFRS 15 using our advanced AI-powered platform.
            </p>
            
            <div className="grid grid-cols-2 gap-6 text-left">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2">CLAUS</h3>
                <p className="text-sm text-gray-300">AI-powered contract analysis and generation</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2">MOCA</h3>
                <p className="text-sm text-gray-300">Intelligent forecasting and revenue modeling</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2">NOVA</h3>
                <p className="text-sm text-gray-300">Executive dashboards with KPI insights</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2">DEAL DESK</h3>
                <p className="text-sm text-gray-300">Streamlined contract approval workflows</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
