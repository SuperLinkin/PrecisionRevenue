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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ClausPage() {
  const [activeTab, setActiveTab] = useState('generate');
  const [uploadedContract, setUploadedContract] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock contract analysis functionality
  const analyzeContract = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResults({
        riskScore: 72,
        issues: [
          { id: 1, severity: 'high', description: 'Ambiguous revenue recognition terms in Section 4.2' },
          { id: 2, severity: 'medium', description: 'Potential conflict between general terms and SOW exhibit' },
          { id: 3, severity: 'low', description: 'Insufficient detail in acceptance criteria' }
        ],
        recommendations: [
          'Clearly define revenue recognition criteria with specific milestones',
          'Align terms across all contract documents to eliminate conflicts',
          'Expand acceptance criteria with measurable metrics'
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  // Mock contract template data
  const contractTemplates = [
    { id: 1, name: 'SaaS Subscription Agreement', category: 'Software' },
    { id: 2, name: 'Professional Services Agreement', category: 'Services' },
    { id: 3, name: 'Master Service Agreement', category: 'General' },
    { id: 4, name: 'Revenue Share Agreement', category: 'Financial' },
    { id: 5, name: 'Sales Partner Agreement', category: 'Channel' }
  ];

  // Conditionally render content based on the active tab
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="CLAUS" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-4 sm:px-0">
              
              {/* Intro Section */}
              <div className="mb-8">
                <h2 className="text-2xl text-primary">Contract Language Analysis & Utilization System</h2>
                <p className="text-neutral mt-2">
                  CLAUS helps you generate, analyze, and optimize legal contracts with advanced language processing.
                </p>
              </div>
              
              {/* Main Tabs */}
              <Tabs 
                defaultValue="generate" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="generate">Generate Contract</TabsTrigger>
                  <TabsTrigger value="analyze">Analyze Contract</TabsTrigger>
                  <TabsTrigger value="library">Contract Library</TabsTrigger>
                </TabsList>
                
                {/* Generate Contract Tab */}
                <TabsContent value="generate" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Contract Generator</CardTitle>
                      <CardDescription>
                        Create customized contracts based on your business requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="contract-type">Contract Type</Label>
                            <select 
                              id="contract-type" 
                              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select a contract type</option>
                              <option value="saas">SaaS Subscription Agreement</option>
                              <option value="professional">Professional Services Agreement</option>
                              <option value="msa">Master Service Agreement</option>
                              <option value="revenue">Revenue Share Agreement</option>
                              <option value="partner">Sales Partner Agreement</option>
                            </select>
                          </div>
                          
                          <div>
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input id="company-name" placeholder="Your company name" />
                          </div>
                          
                          <div>
                            <Label htmlFor="customer-name">Customer/Partner Name</Label>
                            <Input id="customer-name" placeholder="Counterparty name" />
                          </div>
                          
                          <div>
                            <Label htmlFor="contract-value">Contract Value</Label>
                            <Input id="contract-value" placeholder="e.g. $10,000" />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="term-length">Term Length</Label>
                            <div className="flex space-x-2">
                              <Input id="term-length" placeholder="e.g. 12" className="flex-1" />
                              <select 
                                id="term-unit" 
                                className="w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              >
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                              </select>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="jurisdiction">Governing Law</Label>
                            <Input id="jurisdiction" placeholder="e.g. California" />
                          </div>
                          
                          <div>
                            <Label htmlFor="special-terms">Special Terms</Label>
                            <Textarea 
                              id="special-terms" 
                              placeholder="Enter any special terms or considerations"
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Preview</Button>
                        <Button>Generate Contract</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    <AnimatedCard delay={0.1}>
                      <div className="rounded-lg bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="text-base text-primary">Compliance Focused</h3>
                        <p className="text-sm text-secondary-foreground mt-2">
                          Contracts generated with CLAUS are designed for full regulatory compliance.
                        </p>
                      </div>
                    </AnimatedCard>
                    
                    <AnimatedCard delay={0.2}>
                      <div className="rounded-lg bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="text-base text-primary">Revenue Recognition Ready</h3>
                        <p className="text-sm text-secondary-foreground mt-2">
                          Built-in terms that enable clear performance obligation identification.
                        </p>
                      </div>
                    </AnimatedCard>
                    
                    <AnimatedCard delay={0.3}>
                      <div className="rounded-lg bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="text-base text-primary">Customizable Templates</h3>
                        <p className="text-sm text-secondary-foreground mt-2">
                          Tailor contracts to specific business needs while maintaining legal integrity.
                        </p>
                      </div>
                    </AnimatedCard>
                  </div>
                </TabsContent>
                
                {/* Analyze Contract Tab */}
                <TabsContent value="analyze" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Contract Analysis</CardTitle>
                      <CardDescription>
                        Upload a contract to identify potential risks and optimization opportunities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!uploadedContract && (
                        <div className="flex items-center justify-center w-full">
                          <label htmlFor="contract-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-neutral-50 dark:hover:bg-slate-800">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FileText className="w-10 h-10 mb-3 text-secondary" />
                              <p className="mb-2 text-sm text-neutral">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PDF, DOCX, or TXT (MAX. 10MB)
                              </p>
                            </div>
                            <input id="contract-upload" type="file" className="hidden" onChange={() => setUploadedContract('Sample Contract.pdf')} />
                          </label>
                        </div>
                      )}
                      
                      {uploadedContract && !analysisResults && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm">{uploadedContract}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setUploadedContract(null)}>
                              Remove
                            </Button>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button 
                              onClick={analyzeContract} 
                              disabled={isAnalyzing}
                            >
                              {isAnalyzing ? (
                                <>
                                  <span className="animate-spin mr-2">⏳</span>
                                  Analyzing...
                                </>
                              ) : 'Analyze Contract'}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {analysisResults && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-6"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-base text-primary">Analysis Results</h3>
                            <Badge variant={analysisResults.riskScore > 80 ? "destructive" : analysisResults.riskScore > 60 ? "default" : "outline"}>
                              Risk Score: {analysisResults.riskScore}/100
                            </Badge>
                          </div>
                          
                          <div>
                            <h4 className="text-sm text-primary mb-2">Identified Issues</h4>
                            <div className="space-y-2">
                              {analysisResults.issues.map((issue: any) => (
                                <Alert key={issue.id} className={
                                  issue.severity === 'high' 
                                    ? "border-red-600 text-red-600" 
                                    : issue.severity === 'medium' 
                                      ? "border-amber-600 text-amber-600" 
                                      : "border-blue-600 text-blue-600"
                                }>
                                  <AlertTitle>
                                    {issue.severity === 'high' ? 'High Risk' : issue.severity === 'medium' ? 'Medium Risk' : 'Low Risk'}
                                  </AlertTitle>
                                  <AlertDescription>
                                    {issue.description}
                                  </AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm text-primary mb-2">Recommendations</h4>
                            <ul className="space-y-2 list-disc pl-5">
                              {analysisResults.recommendations.map((rec: string, index: number) => (
                                <li key={index} className="text-sm text-neutral">{rec}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => {
                              setUploadedContract(null);
                              setAnalysisResults(null);
                            }}>
                              New Analysis
                            </Button>
                            <Button>
                              Export Report
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Contract Library Tab */}
                <TabsContent value="library" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Contract Templates</CardTitle>
                      <CardDescription>
                        Browse and use pre-approved contract templates for your business needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative overflow-x-auto rounded-md">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase bg-secondary/10">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-primary">Template Name</th>
                              <th scope="col" className="px-6 py-3 text-primary">Category</th>
                              <th scope="col" className="px-6 py-3 text-primary">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contractTemplates.map((template) => (
                              <tr key={template.id} className="border-b hover:bg-secondary/5">
                                <td className="px-6 py-4 text-neutral">{template.name}</td>
                                <td className="px-6 py-4 text-neutral">{template.category}</td>
                                <td className="px-6 py-4">
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">Preview</Button>
                                    <Button size="sm" onClick={() => setActiveTab('generate')}>Use Template</Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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