import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Check, CopyIcon, Download, FileDown, FileText, Plus, Save } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';

// Mock disclosure sections
const disclosureSections = [
  {
    id: 'intro',
    name: 'Introduction',
    content: 'The Company recognizes revenue in accordance with ASC 606, Revenue from Contracts with Customers. The Company determines revenue recognition through the following five-step model:',
    bulletPoints: [
      'Identification of the contract with a customer',
      'Identification of the performance obligations in the contract',
      'Determination of the transaction price',
      'Allocation of the transaction price to the performance obligations',
      'Recognition of revenue as performance obligations are satisfied'
    ]
  },
  {
    id: 'products',
    name: 'Software Products and Services',
    content: 'The Company offers various software products and services to its customers through subscription and perpetual license arrangements. Our software subscriptions include the following:',
    bulletPoints: [
      'SaaS arrangements that provide customers the right to access software hosted by the Company and the associated support services',
      'On-premises software subscription arrangements that include both software licenses and support services',
      'Professional services including implementation, training, and consulting'
    ]
  },
  {
    id: 'timing',
    name: 'Timing of Revenue Recognition',
    content: 'For SaaS arrangements, the Company recognizes revenue ratably over the subscription term as customers simultaneously receive and consume the benefits. For on-premises software with distinct license and support components:',
    bulletPoints: [
      'License revenue is recognized at the point in time when control of the license transfers to the customer',
      'Support revenue is recognized ratably over the support period',
      'Professional services revenue is generally recognized over time as the services are delivered'
    ]
  },
  {
    id: 'contracts',
    name: 'Contract Modifications',
    content: 'The Company accounts for contract modifications as either a separate contract or as an adjustment to the existing contract, depending on the nature of the modification:',
    bulletPoints: [
      'Modifications that add distinct goods or services at their standalone selling price are treated as separate contracts',
      'Modifications that do not add distinct goods or services are accounted for as an adjustment to the original contract',
      'For modifications to subscription services, the additional consideration is typically recognized over the remaining term'
    ]
  },
  {
    id: 'obligations',
    name: 'Performance Obligations',
    content: 'The Company\'s performance obligations include software licenses, SaaS subscriptions, support and maintenance, and professional services. The Company\'s typical performance obligations include:',
    bulletPoints: [
      'Software licenses: Control transfers at the point in time when the license is made available to the customer',
      'SaaS subscriptions: The obligation to provide continuous access to the SaaS platform, recognized ratably over the subscription term',
      'Support and maintenance: The stand-ready obligation to provide technical support and software updates, recognized ratably over the service period',
      'Professional services: Obligations for implementation, configuration, and training services, typically recognized over time'
    ]
  }
];

// Mock compliance standards
const complianceStandards = [
  { id: 'asc606', name: 'ASC 606', selected: true },
  { id: 'ifrs15', name: 'IFRS 15', selected: true },
  { id: 'gaap', name: 'US GAAP', selected: true },
  { id: 'sec', name: 'SEC Reporting', selected: false },
  { id: 'ifrs16', name: 'IFRS 16 (Leases)', selected: false },
  { id: 'saas', name: 'SaaS Industry Guidelines', selected: true }
];

export default function DisclosurePage() {
  // State for selected disclosure sections
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>(
    disclosureSections.reduce((acc, section) => {
      acc[section.id] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  // State for compliance standards
  const [standards, setStandards] = useState(complianceStandards);
  
  // State for company name
  const [companyName, setCompanyName] = useState('Your Company, Inc.');
  
  // State for fiscal period
  const [fiscalPeriod, setFiscalPeriod] = useState('for the year ended December 31, 2023');
  
  // State for generated disclosure
  const [generatedDisclosure, setGeneratedDisclosure] = useState<string | null>(null);
  
  // Toggle section selection
  const toggleSection = (id: string) => {
    setSelectedSections({
      ...selectedSections,
      [id]: !selectedSections[id]
    });
  };
  
  // Toggle standard selection
  const toggleStandard = (id: string) => {
    setStandards(standards.map(standard => 
      standard.id === id 
        ? { ...standard, selected: !standard.selected } 
        : standard
    ));
  };
  
  // Generate disclosure
  const generateDisclosure = () => {
    // Start with the company header
    let disclosure = `# ${companyName}\n`;
    disclosure += `## Revenue Recognition Disclosure ${fiscalPeriod}\n\n`;
    
    // Add a note about which standards are being followed
    const followedStandards = standards.filter(s => s.selected).map(s => s.name);
    disclosure += `*This disclosure is prepared in accordance with ${followedStandards.join(', ')}.*\n\n`;
    
    // Add selected sections
    disclosureSections.forEach(section => {
      if (selectedSections[section.id]) {
        disclosure += `### ${section.name}\n\n`;
        disclosure += `${section.content}\n\n`;
        
        if (section.bulletPoints && section.bulletPoints.length > 0) {
          section.bulletPoints.forEach(point => {
            disclosure += `- ${point}\n`;
          });
          disclosure += '\n';
        }
      }
    });
    
    setGeneratedDisclosure(disclosure);
  };
  
  // Reset form
  const resetForm = () => {
    setSelectedSections(
      disclosureSections.reduce((acc, section) => {
        acc[section.id] = true;
        return acc;
      }, {} as Record<string, boolean>)
    );
    setStandards(complianceStandards);
    setCompanyName('Your Company, Inc.');
    setFiscalPeriod('for the year ended December 31, 2023');
    setGeneratedDisclosure(null);
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Disclosure Generator" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-4 sm:px-0">
              
              {/* Intro Section */}
              <div className="mb-8">
                <h2 className="text-2xl text-primary">Financial Report Disclosure Generator</h2>
                <p className="text-neutral mt-2">
                  Create precise, compliance-ready revenue recognition disclosures for financial reporting.
                </p>
              </div>
              
              {/* Main Content */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column - Generator Controls */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Disclosure Settings</CardTitle>
                      <CardDescription>
                        Configure your disclosure requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input 
                            id="company-name" 
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="fiscal-period">Fiscal Period</Label>
                          <Input 
                            id="fiscal-period" 
                            value={fiscalPeriod}
                            onChange={(e) => setFiscalPeriod(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Compliance Standards</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {standards.map((standard) => (
                            <div key={standard.id} className="flex items-center space-x-2">
                              <Switch
                                id={`standard-${standard.id}`}
                                checked={standard.selected}
                                onCheckedChange={() => toggleStandard(standard.id)}
                              />
                              <Label htmlFor={`standard-${standard.id}`} className="cursor-pointer">
                                {standard.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Disclosure Sections</Label>
                        <div className="space-y-2">
                          {disclosureSections.map((section) => (
                            <div key={section.id} className="flex items-center space-x-2 rounded-md border p-2">
                              <Switch
                                id={`section-${section.id}`}
                                checked={selectedSections[section.id]}
                                onCheckedChange={() => toggleSection(section.id)}
                              />
                              <Label htmlFor={`section-${section.id}`} className="flex-1 cursor-pointer">
                                {section.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={resetForm}
                        >
                          Reset
                        </Button>
                        <Button 
                          onClick={generateDisclosure}
                        >
                          Generate Disclosure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <AnimatedCard>
                    <div className="rounded-lg bg-primary p-6 text-white">
                      <h3 className="text-xl mb-4">Disclosure Best Practices</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span>Be specific about performance obligations and timing of revenue recognition</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span>Clearly describe how transaction prices are allocated to performance obligations</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span>Include significant judgments made in revenue recognition policies</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span>Address contract costs, including capitalization and amortization</span>
                        </li>
                      </ul>
                    </div>
                  </AnimatedCard>
                </div>
                
                {/* Right Column - Generated Disclosure */}
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">Generated Disclosure</CardTitle>
                    <CardDescription>
                      Preview and export your revenue recognition disclosure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {!generatedDisclosure ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                        <FileText className="h-12 w-12 mb-4 text-muted-foreground" />
                        <p className="mb-4">
                          Your generated disclosure will appear here after you configure and generate it.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={generateDisclosure}
                        >
                          Generate Example
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full">
                        <div className="border rounded-md p-4 overflow-y-auto flex-1 bg-background">
                          <pre className="whitespace-pre-wrap text-sm">
                            {generatedDisclosure}
                          </pre>
                        </div>
                        
                        <div className="flex justify-between mt-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                if (generatedDisclosure) {
                                  navigator.clipboard.writeText(generatedDisclosure);
                                }
                              }}
                            >
                              <CopyIcon className="mr-2 h-4 w-4" />
                              Copy
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <FileDown className="mr-2 h-4 w-4" />
                              Export
                            </Button>
                          </div>
                          <Button size="sm">
                            <Save className="mr-2 h-4 w-4" />
                            Save to Library
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Additional Options */}
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">Custom Disclosure Builder</CardTitle>
                    <CardDescription>
                      Create custom disclosure sections or edit existing ones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                      <Button className="mb-4 md:mb-0" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Custom Section
                      </Button>
                      <Button className="mb-4 md:mb-0" variant="outline">
                        Import from Previous Filing
                      </Button>
                      <Button className="mb-4 md:mb-0" variant="outline">
                        Access Template Library
                      </Button>
                      <AnimatedButton className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download Full Disclosure Package
                      </AnimatedButton>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}