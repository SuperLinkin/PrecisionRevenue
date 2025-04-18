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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  role: z.string().min(1, 'Please select your role'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  // Temporarily define a mock register function instead of using useAuth()
  const mockRegister = () => Promise.resolve({});
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      fullName: '',
      companyName: '',
      role: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { register } = useAuth();

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsSubmitting(true);
      
      // In a real implementation we would:
      // 1. Create a tenant with companyName
      // 2. Create a user with tenant_id
      
      await register({
        username: values.username,
        email: values.email,
        fullName: values.fullName,
        password: values.password,
        role: values.role,
        // These would normally be populated properly
        tenantData: {
          name: values.companyName,
          subdomain: values.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')
        }
      });
      
      toast({
        title: "Account Created",
        description: "Your account has been created successfully. Welcome to PRA!",
        variant: "default",
      });
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
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
        {/* Left side - Signup form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-primary mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join PRA to manage your revenue automation</p>
            </div>
            
            <Card className="border-0 shadow-xl">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                            <FormControl>
                              <Input 
                                className="h-10 border-gray-300 focus:ring-2 focus:ring-secondary/20"
                                placeholder="username" 
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
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                            <FormControl>
                              <Input 
                                className="h-10 border-gray-300 focus:ring-2 focus:ring-secondary/20"
                                type="email" 
                                placeholder="name@example.com" 
                                {...field} 
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage className="text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              className="h-10 border-gray-300 focus:ring-2 focus:ring-secondary/20"
                              placeholder="John Doe" 
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
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Company Name</FormLabel>
                          <FormControl>
                            <Input 
                              className="h-10 border-gray-300 focus:ring-2 focus:ring-secondary/20"
                              placeholder="Acme Corporation" 
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
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Your Role</FormLabel>
                          <Select
                            disabled={isSubmitting}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 border-gray-300 focus:ring-2 focus:ring-secondary/20">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cfo">Chief Financial Officer</SelectItem>
                              <SelectItem value="finance_director">Finance Director</SelectItem>
                              <SelectItem value="accounting_manager">Accounting Manager</SelectItem>
                              <SelectItem value="controller">Controller</SelectItem>
                              <SelectItem value="revenue_manager">Revenue Manager</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                            <FormControl>
                              <Input 
                                className="h-10 border-gray-300 focus:ring-2 focus:ring-secondary/20"
                                type="password" 
                                placeholder="********" 
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
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                className="h-10 border-gray-300 focus:ring-2 focus:ring-secondary/20"
                                type="password" 
                                placeholder="********" 
                                {...field} 
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage className="text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="text-sm text-gray-600 pt-2">
                      By creating an account, you agree to our <a href="#" className="text-secondary hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-secondary hover:underline font-medium">Privacy Policy</a>.
                    </div>
                    
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
                            Creating Account...
                          </div>
                        ) : "Create Account"}
                      </Button>
                    </div>
                    
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login">
                          <span className="text-secondary hover:underline cursor-pointer font-medium">
                            Sign in
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
        
        {/* Right side - Benefits section */}
        <div className="hidden md:flex md:w-1/2 bg-primary p-12 flex-col justify-center items-center text-white">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">Enterprise-Grade Revenue Management</h2>
            <p className="text-gray-300 mb-8">
              PRA helps financial teams streamline revenue recognition, contract management, 
              and automate compliance with ASC 606/IFRS 15.
            </p>
            
            <div className="space-y-6">
              <div className="bg-white/10 p-5 rounded-lg text-left">
                <h3 className="font-bold text-lg mb-2">Multi-Tenant Architecture</h3>
                <p className="text-sm text-gray-300">Secure isolation of your organization's data while maintaining full access controls.</p>
              </div>
              
              <div className="bg-white/10 p-5 rounded-lg text-left">
                <h3 className="font-bold text-lg mb-2">Advanced AI Tools</h3>
                <p className="text-sm text-gray-300">CLAUS contract analysis, MOCA forecasting, and comprehensive revenue recognition automation.</p>
              </div>
              
              <div className="bg-white/10 p-5 rounded-lg text-left">
                <h3 className="font-bold text-lg mb-2">Complete Audit Trail</h3>
                <p className="text-sm text-gray-300">Keep track of all revenue recognition decisions with full documentation and transparency.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
