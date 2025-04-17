import { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Company } from '@shared/schema';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().optional(),
  size: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
});

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      username: user?.username || '',
    },
  });
  
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const { data: company } = useQuery<Company>({
    queryKey: ['/api/companies', user?.companyId],
    queryFn: async () => {
      if (!user?.companyId) throw new Error('No company ID');
      const res = await fetch(`/api/companies/${user.companyId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch company');
      return res.json();
    },
    enabled: !!user?.companyId,
  });
  
  const companyForm = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name || '',
      industry: company?.industry || '',
      size: company?.size || '',
      address: company?.address || '',
      phone: company?.phone || '',
      website: company?.website || '',
    },
  });
  
  // Update form when company data is loaded
  useState(() => {
    if (company) {
      companyForm.reset({
        name: company.name,
        industry: company.industry || '',
        size: company.size || '',
        address: company.address || '',
        phone: company.phone || '',
        website: company.website || '',
      });
    }
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof profileSchema>) => {
      // In a real app, would implement this endpoint
      toast({
        title: "Profile update",
        description: "This functionality is not implemented in the demo.",
      });
      return values;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
  });
  
  const updatePasswordMutation = useMutation({
    mutationFn: async (values: z.infer<typeof passwordSchema>) => {
      // In a real app, would implement this endpoint
      toast({
        title: "Password update",
        description: "This functionality is not implemented in the demo.",
      });
      return values;
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
        variant: "default",
      });
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
  });
  
  const updateCompanyMutation = useMutation({
    mutationFn: async (values: z.infer<typeof companySchema>) => {
      if (!user?.companyId) throw new Error('No company ID');
      return apiRequest('PUT', `/api/companies/${user.companyId}`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies', user?.companyId] });
      toast({
        title: "Company updated",
        description: "Company information has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update company information.",
        variant: "destructive",
      });
    },
  });
  
  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate(values);
  };
  
  const onPasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    updatePasswordMutation.mutate(values);
  };
  
  const onCompanySubmit = (values: z.infer<typeof companySchema>) => {
    updateCompanyMutation.mutate(values);
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Settings" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Update your personal details and contact information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                            <FormField
                              control={profileForm.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end">
                              <Button 
                                type="submit" 
                                disabled={updateProfileMutation.isPending}
                              >
                                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                    
                    {/* Password */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                          Update your password to keep your account secure
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...passwordForm}>
                          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="password" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="password" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm New Password</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="password" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end">
                              <Button 
                                type="submit" 
                                disabled={updatePasswordMutation.isPending}
                              >
                                {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Account */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                      <CardDescription>
                        Manage your account settings and profile picture
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                          <AvatarFallback className="text-lg">
                            {user?.fullName ? getInitials(user.fullName) : getInitials(user?.username || '')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <h3 className="text-xl font-medium text-primary">
                            {user?.fullName || user?.username}
                          </h3>
                          <p className="text-sm text-neutral">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button variant="outline">
                          Upload Picture
                        </Button>
                        <Button variant="outline" className="text-destructive hover:text-destructive">
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="company" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                      <CardDescription>
                        Update your company details and contact information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...companyForm}>
                        <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                          <FormField
                            control={companyForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={companyForm.control}
                              name="industry"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Industry</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select industry" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="technology">Technology</SelectItem>
                                      <SelectItem value="finance">Finance</SelectItem>
                                      <SelectItem value="healthcare">Healthcare</SelectItem>
                                      <SelectItem value="retail">Retail</SelectItem>
                                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={companyForm.control}
                              name="size"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Size</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select size" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="1-10">1-10 employees</SelectItem>
                                      <SelectItem value="11-50">11-50 employees</SelectItem>
                                      <SelectItem value="51-100">51-100 employees</SelectItem>
                                      <SelectItem value="101-500">101-500 employees</SelectItem>
                                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                      <SelectItem value="1000+">1000+ employees</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={companyForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={companyForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={companyForm.control}
                              name="website"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Website</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button 
                              type="submit" 
                              disabled={updateCompanyMutation.isPending}
                            >
                              {updateCompanyMutation.isPending ? 'Saving...' : 'Save Company Information'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Manage how you receive notifications and updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                          <span>Email Notifications</span>
                          <span className="font-normal text-sm text-neutral">Receive email updates about your account activity</span>
                        </Label>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="revenue-alerts" className="flex flex-col space-y-1">
                          <span>Revenue Recognition Alerts</span>
                          <span className="font-normal text-sm text-neutral">Get notified when revenue recognition events occur</span>
                        </Label>
                        <Switch id="revenue-alerts" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="contract-updates" className="flex flex-col space-y-1">
                          <span>Contract Updates</span>
                          <span className="font-normal text-sm text-neutral">Receive notifications when contracts are created or modified</span>
                        </Label>
                        <Switch id="contract-updates" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="task-reminders" className="flex flex-col space-y-1">
                          <span>Task Reminders</span>
                          <span className="font-normal text-sm text-neutral">Get reminders about upcoming tasks and deadlines</span>
                        </Label>
                        <Switch id="task-reminders" defaultChecked />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="outline">Save Preferences</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Display Settings</CardTitle>
                      <CardDescription>
                        Customize how the application looks and behaves
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select defaultValue="light">
                          <SelectTrigger id="theme">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select defaultValue="mdy">
                          <SelectTrigger id="date-format">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="cad">CAD ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="outline">Save Display Settings</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
