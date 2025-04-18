import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Filter, 
  FileText, 
  Plus, 
  Search, 
  UserPlus, 
  Users 
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/utils';

// Mock deals data
const dealsData = [
  { 
    id: 'deal-001', 
    company: 'Acme Corporation', 
    value: 125000, 
    stage: 'negotiation', 
    creator: 'Alex Johnson',
    creatorAvatar: 'AJ',
    created: '2023-10-15',
    dueDate: '2023-12-15',
    product: 'Enterprise Plan',
    description: 'Annual renewal with additional user licenses',
    stakeholders: ['Sales', 'Finance', 'Legal']
  },
  { 
    id: 'deal-002', 
    company: 'Globex Industries', 
    value: 85000, 
    stage: 'review', 
    creator: 'Sam Taylor',
    creatorAvatar: 'ST',
    created: '2023-10-25',
    dueDate: '2023-11-30',
    product: 'Advanced Plan',
    description: 'New customer implementation with custom integrations',
    stakeholders: ['Sales', 'Product', 'Implementation']
  },
  { 
    id: 'deal-003', 
    company: 'Massive Dynamics', 
    value: 220000, 
    stage: 'approval', 
    creator: 'Jamie Lee',
    creatorAvatar: 'JL',
    created: '2023-11-02',
    dueDate: '2023-12-05',
    product: 'Enterprise Plan',
    description: 'Expansion deal with current customer, adding new business unit',
    stakeholders: ['Sales', 'Finance', 'Customer Success']
  },
  { 
    id: 'deal-004', 
    company: 'Initech Solutions', 
    value: 75000, 
    stage: 'draft', 
    creator: 'Casey Kim',
    creatorAvatar: 'CK',
    created: '2023-11-10',
    dueDate: '2023-12-20',
    product: 'Standard Plan',
    description: 'Potential upgrade from Standard to Advanced plan',
    stakeholders: ['Sales', 'Product']
  },
  { 
    id: 'deal-005', 
    company: 'Soylent Corp', 
    value: 165000, 
    stage: 'approved', 
    creator: 'Riley Smith',
    creatorAvatar: 'RS',
    created: '2023-10-05',
    dueDate: '2023-11-15',
    product: 'Enterprise Plan',
    description: 'Multi-year enterprise agreement with professional services',
    stakeholders: ['Sales', 'Finance', 'Legal', 'Services']
  },
];

// Mock templates data
const templateData = [
  { id: 'tpl-001', name: 'Standard SaaS Deal', description: 'For standard software subscription deals', usageCount: 48 },
  { id: 'tpl-002', name: 'Enterprise Agreement', description: 'For large enterprise customers with custom terms', usageCount: 32 },
  { id: 'tpl-003', name: 'Renewal with Expansion', description: 'For renewing customers with additional services/users', usageCount: 26 },
  { id: 'tpl-004', name: 'Partner/Reseller Deal', description: 'For channel partners and resellers', usageCount: 15 },
];

// Mock approvers data
const approversData = [
  { id: 'apr-001', name: 'Maya Rodriguez', role: 'Finance Director', department: 'Finance', avatar: 'MR' },
  { id: 'apr-002', name: 'Daniel Chen', role: 'Legal Counsel', department: 'Legal', avatar: 'DC' },
  { id: 'apr-003', name: 'Sarah Wilson', role: 'VP of Sales', department: 'Sales', avatar: 'SW' },
  { id: 'apr-004', name: 'James Taylor', role: 'Revenue Operations', department: 'Finance', avatar: 'JT' },
];

export default function DealDeskPage() {
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('deals');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  
  // Get the selected deal details
  const dealDetails = dealsData.find(deal => deal.id === selectedDeal);
  
  // Filter deals based on search query and stage filter
  const filteredDeals = dealsData.filter(deal => {
    const matchesQuery = deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        deal.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        deal.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStage = stageFilter ? deal.stage === stageFilter : true;
    
    return matchesQuery && matchesStage;
  });
  
  // Get deal stage badge color
  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'negotiation':
        return 'bg-amber-100 text-amber-800';
      case 'approval':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get deal stage readable name
  const getStageName = (stage: string) => {
    switch (stage) {
      case 'draft':
        return 'Draft';
      case 'review':
        return 'In Review';
      case 'negotiation':
        return 'Negotiation';
      case 'approval':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      default:
        return stage;
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Deal Desk" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-4 sm:px-0">
              
              {/* Intro Section */}
              <div className="mb-8">
                <h2 className="text-2xl text-primary">Deal Desk Management</h2>
                <p className="text-neutral mt-2">
                  Streamline the creation, review, and approval of deals across departments.
                </p>
              </div>
              
              {/* Main Tabs */}
              <Tabs 
                defaultValue="deals" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="deals">Active Deals</TabsTrigger>
                  <TabsTrigger value="templates">Deal Templates</TabsTrigger>
                  <TabsTrigger value="approvers">Approval Workflows</TabsTrigger>
                  <TabsTrigger value="analytics">Deal Analytics</TabsTrigger>
                </TabsList>
                
                {/* Active Deals Tab */}
                <TabsContent value="deals" className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-72 mb-4 md:mb-0">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search deals..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <div className="relative">
                        <select 
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          value={stageFilter || ''}
                          onChange={(e) => setStageFilter(e.target.value || null)}
                        >
                          <option value="">All Stages</option>
                          <option value="draft">Draft</option>
                          <option value="review">In Review</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="approval">Pending Approval</option>
                          <option value="approved">Approved</option>
                        </select>
                      </div>
                      
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Deal
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Deals List */}
                    <div className="md:col-span-1 space-y-4">
                      {filteredDeals.length === 0 ? (
                        <Card>
                          <CardContent className="p-6 text-center">
                            <p className="text-muted-foreground">No deals found matching your criteria.</p>
                          </CardContent>
                        </Card>
                      ) : (
                        filteredDeals.map((deal) => (
                          <Card 
                            key={deal.id}
                            className={`cursor-pointer hover:border-primary transition-colors ${selectedDeal === deal.id ? 'border-primary' : ''}`}
                            onClick={() => setSelectedDeal(deal.id)}
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-primary text-base">{deal.company}</h3>
                                <Badge className={getStageBadgeColor(deal.stage)}>
                                  {getStageName(deal.stage)}
                                </Badge>
                              </div>
                              <p className="text-sm text-neutral mb-2">{deal.product}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-secondary">{formatCurrency(deal.value)}</span>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(deal.dueDate).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center mt-3 pt-3 border-t text-xs text-muted-foreground">
                                <Avatar className="h-5 w-5 mr-2">
                                  <AvatarFallback className="text-[10px]">{deal.creatorAvatar}</AvatarFallback>
                                </Avatar>
                                <span>{deal.creator}</span>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                    
                    {/* Deal Details */}
                    <div className="md:col-span-2">
                      {!selectedDeal ? (
                        <Card className="h-full flex items-center justify-center">
                          <CardContent className="p-6 text-center">
                            <FileText className="h-12 w-12 mb-4 mx-auto text-muted-foreground" />
                            <h3 className="text-lg text-primary mb-2">Select a Deal</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Choose a deal from the list to view its details
                            </p>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Create New Deal
                            </Button>
                          </CardContent>
                        </Card>
                      ) : dealDetails && (
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl text-primary">{dealDetails.company}</CardTitle>
                                <CardDescription>
                                  {dealDetails.product} - {formatCurrency(dealDetails.value)}
                                </CardDescription>
                              </div>
                              <Badge className={getStageBadgeColor(dealDetails.stage)}>
                                {getStageName(dealDetails.stage)}
                              </Badge>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Created By</p>
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarFallback>{dealDetails.creatorAvatar}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-neutral">{dealDetails.creator}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Due Date</p>
                                <p className="text-sm text-neutral">{new Date(dealDetails.dueDate).toLocaleDateString()}</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Deal ID</p>
                                <p className="text-sm text-neutral">{dealDetails.id}</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Created On</p>
                                <p className="text-sm text-neutral">{new Date(dealDetails.created).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">Description</p>
                              <p className="text-sm text-neutral p-3 bg-secondary/10 rounded-md">{dealDetails.description}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">Stakeholders</p>
                              <div className="flex flex-wrap gap-2">
                                {dealDetails.stakeholders.map((stakeholder, index) => (
                                  <Badge key={index} variant="outline" className="bg-secondary/10">
                                    {stakeholder}
                                  </Badge>
                                ))}
                                <Button variant="outline" size="sm" className="h-6">
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm text-primary">Approval Progress</h4>
                                <Badge variant={dealDetails.stage === 'approved' ? 'default' : 'outline'}>
                                  {dealDetails.stage === 'approved' ? 'Completed' : 'In Progress'}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <div className="bg-green-500 rounded-full h-6 w-6 flex items-center justify-center text-white">
                                    <CheckCircle2 className="h-4 w-4" />
                                  </div>
                                  <div className="h-0.5 flex-1 bg-green-500"></div>
                                  <div className={`rounded-full h-6 w-6 flex items-center justify-center text-white ${dealDetails.stage === 'draft' || dealDetails.stage === 'review' || dealDetails.stage === 'negotiation' || dealDetails.stage === 'approval' || dealDetails.stage === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <CheckCircle2 className="h-4 w-4" />
                                  </div>
                                  <div className={`h-0.5 flex-1 ${dealDetails.stage === 'review' || dealDetails.stage === 'negotiation' || dealDetails.stage === 'approval' || dealDetails.stage === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                  <div className={`rounded-full h-6 w-6 flex items-center justify-center text-white ${dealDetails.stage === 'negotiation' || dealDetails.stage === 'approval' || dealDetails.stage === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <CheckCircle2 className="h-4 w-4" />
                                  </div>
                                  <div className={`h-0.5 flex-1 ${dealDetails.stage === 'approval' || dealDetails.stage === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                  <div className={`rounded-full h-6 w-6 flex items-center justify-center text-white ${dealDetails.stage === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <CheckCircle2 className="h-4 w-4" />
                                  </div>
                                </div>
                                
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Draft</span>
                                  <span>Review</span>
                                  <span>Negotiation</span>
                                  <span>Approval</span>
                                  <span>Approved</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end space-x-2 border-t">
                              <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Deal
                              </Button>
                              
                              {dealDetails.stage !== 'approved' && (
                                <AnimatedButton>
                                  {dealDetails.stage === 'approval' ? 'Approve Deal' : 'Move to Next Stage'}
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </AnimatedButton>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Deal Templates Tab */}
                <TabsContent value="templates" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg text-primary">Available Templates</h3>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Template
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {templateData.map((template) => (
                      <Card key={template.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base text-primary">{template.name}</CardTitle>
                          <CardDescription>
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              Used {template.usageCount} times
                            </span>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="mr-2 h-3 w-3" />
                                Edit
                              </Button>
                              <Button size="sm">
                                Use Template
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Template Benefits</CardTitle>
                      <CardDescription>
                        Using standardized templates helps maintain consistency and speeds up the deal process
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="bg-secondary/10 p-4 rounded-md">
                          <h4 className="text-sm text-primary mb-2">Efficiency</h4>
                          <p className="text-xs text-neutral">
                            Templates reduce creation time by 78% and minimize errors in deal structuring
                          </p>
                        </div>
                        
                        <div className="bg-secondary/10 p-4 rounded-md">
                          <h4 className="text-sm text-primary mb-2">Compliance</h4>
                          <p className="text-xs text-neutral">
                            Pre-approved language ensures legal and financial compliance across all deals
                          </p>
                        </div>
                        
                        <div className="bg-secondary/10 p-4 rounded-md">
                          <h4 className="text-sm text-primary mb-2">Revenue Recognition</h4>
                          <p className="text-xs text-neutral">
                            Standardized terms facilitate easier revenue recognition in compliance with accounting standards
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Approval Workflows Tab */}
                <TabsContent value="approvers" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg text-primary">Approval Workflows & Stakeholders</h3>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Workflow
                    </Button>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Default Approval Workflow</CardTitle>
                      <CardDescription>
                        Standard approval sequence for most deals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-10 h-10 bg-green-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                              <Users className="w-5 h-5 text-green-800" />
                            </div>
                            <div className="flex w-full bg-gray-200 h-0.5">
                            </div>
                          </div>
                          <div className="mt-3 sm:pr-8">
                            <h3 className="text-base text-primary">Sales Manager Review</h3>
                            <p className="text-sm text-neutral">
                              Opportunity validation and initial pricing approval
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                              <Users className="w-5 h-5 text-blue-800" />
                            </div>
                            <div className="flex w-full bg-gray-200 h-0.5">
                            </div>
                          </div>
                          <div className="mt-3 sm:pr-8">
                            <h3 className="text-base text-primary">Finance Review</h3>
                            <p className="text-sm text-neutral">
                              Margin analysis and revenue recognition assessment
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                              <Users className="w-5 h-5 text-purple-800" />
                            </div>
                            <div className="flex w-full bg-gray-200 h-0.5">
                            </div>
                          </div>
                          <div className="mt-3 sm:pr-8">
                            <h3 className="text-base text-primary">Legal Review</h3>
                            <p className="text-sm text-neutral">
                              Contract terms verification and risk assessment
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                              <Users className="w-5 h-5 text-amber-800" />
                            </div>
                            <div className="flex w-full bg-gray-200 h-0.5">
                            </div>
                          </div>
                          <div className="mt-3 sm:pr-8">
                            <h3 className="text-base text-primary">Executive Approval</h3>
                            <p className="text-sm text-neutral">
                              Final sign-off for deals above $50,000
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl text-primary">Available Approvers</CardTitle>
                        <CardDescription>
                          Team members who can review and approve deals
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {approversData.map((approver) => (
                            <div key={approver.id} className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarFallback>{approver.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="text-sm text-primary">{approver.name}</h4>
                                  <p className="text-xs text-neutral">{approver.role}</p>
                                </div>
                              </div>
                              <Badge variant="outline">{approver.department}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl text-primary">Workflow Rules</CardTitle>
                        <CardDescription>
                          Configure automatic routing based on deal criteria
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 border rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm text-primary">Deal Value Threshold</h4>
                              <Badge>Active</Badge>
                            </div>
                            <p className="text-xs text-neutral mb-2">
                              Deals above $100,000 require additional executive approval
                            </p>
                            <div className="flex justify-end">
                              <Button size="sm" variant="outline">Edit Rule</Button>
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm text-primary">Multi-Year Contracts</h4>
                              <Badge>Active</Badge>
                            </div>
                            <p className="text-xs text-neutral mb-2">
                              Contracts longer than 12 months require Finance Director review
                            </p>
                            <div className="flex justify-end">
                              <Button size="sm" variant="outline">Edit Rule</Button>
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm text-primary">Custom Terms</h4>
                              <Badge>Active</Badge>
                            </div>
                            <p className="text-xs text-neutral mb-2">
                              Any deviation from standard terms requires Legal review
                            </p>
                            <div className="flex justify-end">
                              <Button size="sm" variant="outline">Edit Rule</Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Rule
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Deal Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Deal Metrics</CardTitle>
                      <CardDescription>
                        Performance statistics for your deal desk operations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="p-4 bg-secondary/10 rounded-md">
                          <p className="text-xs text-muted-foreground mb-1">Average Deal Cycle</p>
                          <div className="flex items-end justify-between">
                            <h3 className="text-2xl text-primary">18.2 days</h3>
                            <span className="text-xs text-green-500">-2.4 days vs. last quarter</span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-secondary/10 rounded-md">
                          <p className="text-xs text-muted-foreground mb-1">Approval Success Rate</p>
                          <div className="flex items-end justify-between">
                            <h3 className="text-2xl text-primary">92%</h3>
                            <span className="text-xs text-green-500">+4% vs. last quarter</span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-secondary/10 rounded-md">
                          <p className="text-xs text-muted-foreground mb-1">Average Deal Value</p>
                          <div className="flex items-end justify-between">
                            <h3 className="text-2xl text-primary">{formatCurrency(134000)}</h3>
                            <span className="text-xs text-green-500">+12.5% vs. last quarter</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm text-primary mb-2">Deal Stage Distribution</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Draft</span>
                                <span>15%</span>
                              </div>
                              <div className="w-full bg-secondary/20 rounded-full h-2">
                                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Review</span>
                                <span>22%</span>
                              </div>
                              <div className="w-full bg-secondary/20 rounded-full h-2">
                                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '22%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Negotiation</span>
                                <span>28%</span>
                              </div>
                              <div className="w-full bg-secondary/20 rounded-full h-2">
                                <div className="bg-amber-400 h-2 rounded-full" style={{ width: '28%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Approval</span>
                                <span>18%</span>
                              </div>
                              <div className="w-full bg-secondary/20 rounded-full h-2">
                                <div className="bg-purple-400 h-2 rounded-full" style={{ width: '18%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Approved</span>
                                <span>17%</span>
                              </div>
                              <div className="w-full bg-secondary/20 rounded-full h-2">
                                <div className="bg-green-400 h-2 rounded-full" style={{ width: '17%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm text-primary mb-2">Bottleneck Analysis</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Sales</span>
                                <span>1.2 days avg. wait</span>
                              </div>
                              <div className="w-full bg-secondary/20 rounded-full h-2">
                                <div className="bg-secondary h-2 rounded-full" style={{ width: '15%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Finance</span>
                                <span>2.8 days avg. wait</span>
                              </div>
                              <div className="w-full bg-secondary/20 rounded-full h-2">
                                <div className="bg-secondary h-2 rounded-full" style={{ width: '35%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Legal</span>
                                <span>4.5 days avg. wait</span>
                              </div>
                              <div className="w-full bg-secondary/20 rounded-full h-2">
                                <div className="bg-secondary h-2 rounded-full" style={{ width: '56%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Product</span>
                                <span>1.5 days avg. wait</span>
                              </div>
                              <div className="w-full bg-secondary/20 rounded-full h-2">
                                <div className="bg-secondary h-2 rounded-full" style={{ width: '19%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Executive</span>
                                <span>3.2 days avg. wait</span>
                              </div>
                              <div className="w-full bg-secondary/20 rounded-full h-2">
                                <div className="bg-secondary h-2 rounded-full" style={{ width: '40%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button>
                          View Full Reports
                        </Button>
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