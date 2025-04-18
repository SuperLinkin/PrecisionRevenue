import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { 
  AlertCircle, 
  Building, 
  Check, 
  ChevronsUpDown,
  Copy, 
  Edit, 
  Map, 
  MoreHorizontal, 
  Plus, 
  Save, 
  Trash2, 
  Upload, 
  UserPlus, 
  Users
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { getInitials } from '@/lib/utils';

// Mock company data
const companyData = {
  name: 'Horizon Technologies',
  industry: 'Software & IT Services',
  address: '123 Innovation Way, San Francisco, CA 94107',
  phone: '(555) 123-4567',
  website: 'www.horizontech.example.com',
  taxId: '12-3456789',
  fiscalYearEnd: '12/31',
  logo: null,
  departments: [
    { id: 'dept-001', name: 'Finance', headCount: 12 },
    { id: 'dept-002', name: 'Sales', headCount: 24 },
    { id: 'dept-003', name: 'Engineering', headCount: 35 },
    { id: 'dept-004', name: 'Marketing', headCount: 8 },
    { id: 'dept-005', name: 'Legal', headCount: 3 },
    { id: 'dept-006', name: 'Customer Success', headCount: 15 }
  ]
};

// Mock users
const usersData = [
  { 
    id: 'user-001', 
    name: 'User 1', 
    email: 'user1@horizontech.example.com', 
    role: 'Admin', 
    department: 'Finance', 
    lastActive: '2023-11-15T10:30:00'
  },
  { 
    id: 'user-002', 
    name: 'Maya Rodriguez', 
    email: 'maya@horizontech.example.com', 
    role: 'Finance Manager', 
    department: 'Finance', 
    lastActive: '2023-11-15T14:20:00'
  },
  { 
    id: 'user-003', 
    name: 'Daniel Chen', 
    email: 'daniel@horizontech.example.com', 
    role: 'Legal Counsel', 
    department: 'Legal', 
    lastActive: '2023-11-14T16:45:00'
  },
  { 
    id: 'user-004', 
    name: 'Sarah Wilson', 
    email: 'sarah@horizontech.example.com', 
    role: 'VP of Sales', 
    department: 'Sales', 
    lastActive: '2023-11-15T09:10:00'
  },
  { 
    id: 'user-005', 
    name: 'James Taylor', 
    email: 'james@horizontech.example.com', 
    role: 'Revenue Analyst', 
    department: 'Finance', 
    lastActive: '2023-11-15T11:05:00'
  }
];

// Mock chart of accounts
const accountsData = [
  { code: '1000', name: 'Cash', type: 'Asset', balance: '$245,892.45' },
  { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: '$187,432.18' },
  { code: '1200', name: 'Inventory', type: 'Asset', balance: '$56,784.92' },
  { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: '$78,123.45' },
  { code: '3000', name: 'Common Stock', type: 'Equity', balance: '$500,000.00' },
  { code: '4000', name: 'Revenue', type: 'Revenue', balance: '$823,417.50' },
  { code: '4100', name: 'SaaS Subscriptions', type: 'Revenue', balance: '$643,250.00' },
  { code: '4200', name: 'Professional Services', type: 'Revenue', balance: '$180,167.50' },
  { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: '$192,354.23' },
  { code: '6000', name: 'Operating Expenses', type: 'Expense', balance: '$345,782.19' },
  { code: '6100', name: 'Salaries and Wages', type: 'Expense', balance: '$245,123.45' },
  { code: '6200', name: 'Rent', type: 'Expense', balance: '$48,000.00' },
  { code: '6300', name: 'Software Subscriptions', type: 'Expense', balance: '$28,965.74' },
  { code: '6400', name: 'Marketing and Advertising', type: 'Expense', balance: '$23,693.00' }
];

export default function CompanyPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter users based on search query
  const filteredUsers = usersData.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Company Settings" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-4 sm:px-0">
              
              {/* Main Tabs */}
              <Tabs 
                defaultValue="profile" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Company Profile</TabsTrigger>
                  <TabsTrigger value="users">Users & Permissions</TabsTrigger>
                  <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
                  <TabsTrigger value="structure">Org Structure</TabsTrigger>
                </TabsList>
                
                {/* Company Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl text-primary">Company Information</h2>
                      <p className="text-sm text-neutral mt-1">
                        Update your company details and preferences
                      </p>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsEditing(false)}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input 
                              id="company-name" 
                              value={companyData.name}
                              disabled={!isEditing}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="industry">Industry</Label>
                            <Input 
                              id="industry" 
                              value={companyData.industry}
                              disabled={!isEditing}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea 
                              id="address" 
                              value={companyData.address}
                              disabled={!isEditing}
                              rows={3}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              value={companyData.phone}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="website">Website</Label>
                            <Input 
                              id="website" 
                              value={companyData.website}
                              disabled={!isEditing}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="tax-id">Tax ID</Label>
                            <Input 
                              id="tax-id" 
                              value={companyData.taxId}
                              disabled={!isEditing}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="fiscal-year">Fiscal Year End</Label>
                            <Input 
                              id="fiscal-year" 
                              value={companyData.fiscalYearEnd}
                              disabled={!isEditing}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="logo" className="block mb-2">Company Logo</Label>
                            <div className="flex items-center space-x-4">
                              <div className="bg-secondary/10 h-16 w-16 rounded-md flex items-center justify-center">
                                {companyData.logo ? (
                                  <img 
                                    src={companyData.logo} 
                                    alt="Company Logo" 
                                    className="max-h-14 max-w-14" 
                                  />
                                ) : (
                                  <Building className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                              
                              {isEditing && (
                                <Button variant="outline" size="sm">
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Logo
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 border-t pt-6">
                        <h3 className="text-base text-primary mb-4">System Preferences</h3>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="flex items-center justify-between border p-4 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Revenue Recognition Method</p>
                              <p className="text-xs text-muted-foreground">ASC 606 / IFRS 15 Compliant</p>
                            </div>
                            
                            <Select defaultValue="percentage" disabled={!isEditing}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="milestone">Milestone</SelectItem>
                                <SelectItem value="time">Time-Based</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between border p-4 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Default Currency</p>
                              <p className="text-xs text-muted-foreground">Used for financial reports</p>
                            </div>
                            
                            <Select defaultValue="usd" disabled={!isEditing}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="usd">USD ($)</SelectItem>
                                <SelectItem value="eur">EUR (€)</SelectItem>
                                <SelectItem value="gbp">GBP (£)</SelectItem>
                                <SelectItem value="jpy">JPY (¥)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between border p-4 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Fiscal Year Type</p>
                              <p className="text-xs text-muted-foreground">For reporting periods</p>
                            </div>
                            
                            <Select defaultValue="calendar" disabled={!isEditing}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="calendar">Calendar Year</SelectItem>
                                <SelectItem value="fiscal">Custom Fiscal Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between border p-4 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Enable Department Tracking</p>
                              <p className="text-xs text-muted-foreground">For revenue allocation</p>
                            </div>
                            
                            <Switch checked={true} disabled={!isEditing} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Users & Permissions Tab */}
                <TabsContent value="users" className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl text-primary">Users & Permissions</h2>
                      <p className="text-sm text-neutral mt-1">
                        Manage user access and roles
                      </p>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite User
                      </Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <CardTitle className="text-lg text-primary">Team Members</CardTitle>
                        
                        <div className="relative">
                          <div className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8"></circle>
                              <path d="m21 21-4.3-4.3"></path>
                            </svg>
                          </div>
                          <Input
                            placeholder="Search users..."
                            className="pl-8 w-60"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12"></TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Last Active</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                  </Avatar>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium text-primary">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{user.role}</Badge>
                                </TableCell>
                                <TableCell>{user.department}</TableCell>
                                <TableCell>
                                  {new Date(user.lastActive).toLocaleDateString()} {new Date(user.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">Role Management</CardTitle>
                        <CardDescription>
                          Define access levels and permissions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="text-sm text-primary">Admin</p>
                              <p className="text-xs text-muted-foreground">Full system access</p>
                            </div>
                            <Button variant="outline" size="sm">Edit Role</Button>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="text-sm text-primary">Finance Manager</p>
                              <p className="text-xs text-muted-foreground">Financial data and reporting</p>
                            </div>
                            <Button variant="outline" size="sm">Edit Role</Button>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="text-sm text-primary">Revenue Analyst</p>
                              <p className="text-xs text-muted-foreground">Revenue recognition and analysis</p>
                            </div>
                            <Button variant="outline" size="sm">Edit Role</Button>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="text-sm text-primary">Auditor</p>
                              <p className="text-xs text-muted-foreground">Read-only access to financial data</p>
                            </div>
                            <Button variant="outline" size="sm">Edit Role</Button>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Create Role
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">Security Settings</CardTitle>
                        <CardDescription>
                          Configure system security policies
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border p-3 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Two-Factor Authentication</p>
                              <p className="text-xs text-muted-foreground">Require 2FA for all users</p>
                            </div>
                            <Switch checked={true} />
                          </div>
                          
                          <div className="flex items-center justify-between border p-3 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Session Timeout</p>
                              <p className="text-xs text-muted-foreground">Inactive session expiry</p>
                            </div>
                            <Select defaultValue="30">
                              <SelectTrigger className="w-28">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 min</SelectItem>
                                <SelectItem value="30">30 min</SelectItem>
                                <SelectItem value="60">60 min</SelectItem>
                                <SelectItem value="120">120 min</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between border p-3 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Password Policy</p>
                              <p className="text-xs text-muted-foreground">Minimum requirements</p>
                            </div>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                          
                          <div className="flex items-center justify-between border p-3 rounded-md">
                            <div>
                              <p className="text-sm text-primary">IP Restrictions</p>
                              <p className="text-xs text-muted-foreground">Restrict access by IP</p>
                            </div>
                            <Switch checked={false} />
                          </div>
                          
                          <div className="flex items-center justify-between border p-3 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Audit Logging</p>
                              <p className="text-xs text-muted-foreground">Track all system changes</p>
                            </div>
                            <Switch checked={true} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Chart of Accounts Tab */}
                <TabsContent value="accounts" className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl text-primary">Chart of Accounts</h2>
                      <p className="text-sm text-neutral mt-1">
                        Manage your financial account structure
                      </p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex space-x-2">
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </Button>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Account
                      </Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-0">
                      <div className="rounded-md overflow-hidden border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Account Code</TableHead>
                              <TableHead>Account Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead className="text-right">Balance</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {accountsData.map((account) => (
                              <TableRow key={account.code}>
                                <TableCell className="font-medium">{account.code}</TableCell>
                                <TableCell>{account.name}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{account.type}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{account.balance}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">Account Settings</CardTitle>
                        <CardDescription>
                          Configure financial account settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border p-3 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Accounting Method</p>
                              <p className="text-xs text-muted-foreground">Method for recording transactions</p>
                            </div>
                            <Select defaultValue="accrual">
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="accrual">Accrual</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between border p-3 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Default Revenue Account</p>
                              <p className="text-xs text-muted-foreground">For new revenue streams</p>
                            </div>
                            <Select defaultValue="4000">
                              <SelectTrigger className="w-36">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="4000">4000 - Revenue</SelectItem>
                                <SelectItem value="4100">4100 - SaaS Subscriptions</SelectItem>
                                <SelectItem value="4200">4200 - Professional Services</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between border p-3 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Auto-Reconciliation</p>
                              <p className="text-xs text-muted-foreground">Automatic transaction matching</p>
                            </div>
                            <Switch checked={true} />
                          </div>
                          
                          <div className="flex items-center justify-between border p-3 rounded-md">
                            <div>
                              <p className="text-sm text-primary">Multi-Currency Support</p>
                              <p className="text-xs text-muted-foreground">Track balances in multiple currencies</p>
                            </div>
                            <Switch checked={true} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">Compliance Notes</CardTitle>
                        <CardDescription>
                          Accounting standards compliance information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex p-3 border rounded-md bg-amber-50">
                            <AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-primary">ASC 606 Revenue Recognition</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Your chart of accounts is configured for ASC 606 compliance. Performance obligation accounts are properly set up for revenue recognition.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex p-3 border rounded-md bg-green-50">
                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-primary">Last Audit Completed</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Your chart of accounts was last audited on October 15, 2023 with no reported issues.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex p-3 border rounded-md">
                            <div>
                              <p className="text-sm text-primary">Account Mapping</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Accounts are properly mapped to the appropriate GAAP/IFRS categories for financial reporting.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Org Structure Tab */}
                <TabsContent value="structure" className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl text-primary">Organizational Structure</h2>
                      <p className="text-sm text-neutral mt-1">
                        Configure your company's departments and hierarchy
                      </p>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Department
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">Department Structure</CardTitle>
                        <CardDescription>
                          Manage departments and reporting structure
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Department</TableHead>
                                <TableHead>Head Count</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {companyData.departments.map((dept) => (
                                <TableRow key={dept.id}>
                                  <TableCell className="font-medium">{dept.name}</TableCell>
                                  <TableCell>{dept.headCount}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end space-x-1">
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Users className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                          <Button variant="outline">
                            <Map className="mr-2 h-4 w-4" />
                            View Organization Chart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">Department Allocation</CardTitle>
                        <CardDescription>
                          Revenue allocation by department
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Finance</span>
                              <span>12%</span>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Sales</span>
                              <span>24%</span>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-green-400 h-2 rounded-full" style={{ width: '24%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Engineering</span>
                              <span>36%</span>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-purple-400 h-2 rounded-full" style={{ width: '36%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Marketing</span>
                              <span>8%</span>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-amber-400 h-2 rounded-full" style={{ width: '8%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Legal</span>
                              <span>3%</span>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-red-400 h-2 rounded-full" style={{ width: '3%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Customer Success</span>
                              <span>17%</span>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-teal-400 h-2 rounded-full" style={{ width: '17%' }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-3 bg-secondary/10 rounded-md">
                          <h4 className="text-sm text-primary mb-2">Allocation Settings</h4>
                          <p className="text-xs text-neutral">
                            Revenue is allocated to departments based on user-defined percentage rules. These allocations affect revenue recognition by department.
                          </p>
                          <Button className="mt-4" size="sm" variant="outline">
                            Adjust Allocations
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">Integration Settings</CardTitle>
                      <CardDescription>
                        Configure integrations with other systems
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="flex items-center justify-between border p-4 rounded-md">
                          <div>
                            <p className="text-sm text-primary">HR System Integration</p>
                            <p className="text-xs text-muted-foreground">For department data</p>
                          </div>
                          <Switch checked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between border p-4 rounded-md">
                          <div>
                            <p className="text-sm text-primary">CRM Integration</p>
                            <p className="text-xs text-muted-foreground">For customer data</p>
                          </div>
                          <Switch checked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between border p-4 rounded-md">
                          <div>
                            <p className="text-sm text-primary">ERP Integration</p>
                            <p className="text-xs text-muted-foreground">For financial data</p>
                          </div>
                          <Switch checked={false} />
                        </div>
                      </div>
                    </CardContent>
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