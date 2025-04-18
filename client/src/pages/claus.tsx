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
import { FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Type definitions for contract analysis
interface ContractRisk {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  clause: string;
  mitigation?: string;
}

interface ContractOpportunity {
  category: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
  clause?: string;
  recommendation?: string;
}

interface ContractTermsAnalysis {
  unusualTerms: Array<{
    clause: string;
    description: string;
    impact: string;
  }>;
  favorableTerms: Array<{
    clause: string;
    description: string;
    benefit: string;
  }>;
  nonCompetitiveTerms: Array<{
    clause: string;
    description: string;
    industryStandard: string;
  }>;
}

interface ContractComplianceAnalysis {
  ifrs15Compliance: {
    score: number; // 0-100
    issues: Array<{
      area: string;
      description: string;
      recommendation: string;
    }>;
    strengths: string[];
  };
  regulatoryIssues: Array<{
    regulation: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
}

interface ContractSummary {
  contractType: string;
  parties: string[];
  effectiveDate: string;
  terminationDate: string;
  contractValue: number;
  keyProvisions: string[];
  paymentTerms: string;
  noticeRequirements: string;
  terminationConditions: string[];
  governingLaw: string;
}

interface ContractAnalysis {
  summary: ContractSummary;
  risks: ContractRisk[];
  opportunities: ContractOpportunity[];
  termsAnalysis: ContractTermsAnalysis;
  complianceAnalysis: ContractComplianceAnalysis;
  revenueSummary: {
    totalValue: number;
    recognitionPattern: string;
    specialConsiderations: string[];
    variableComponents: Array<{
      description: string;
      estimatedValue: number;
      contingencies: string;
    }>;
  };
}

interface AnalysisResponse {
  contractId: number;
  contractName: string;
  analysis: ContractAnalysis;
}

export default function ClausPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('generate');
  const [uploadedContract, setUploadedContract] = useState<File | null>(null);
  const [contractText, setContractText] = useState<string>('');
  const [contractBase64, setContractBase64] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<ContractAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check OpenAI API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/contract-analysis/status');
        const data = await response.json();
        setIsApiAvailable(!!data.available);
        
        if (!data.available) {
          toast({
            title: "AI Analysis Unavailable",
            description: data.message || "The contract analysis API is currently unavailable.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to check API status:", error);
        setIsApiAvailable(false);
        toast({
          title: "AI Analysis Unavailable",
          description: "Failed to connect to the contract analysis service.",
          variant: "destructive"
        });
      }
    };
    
    checkApiStatus();
  }, [toast]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    // Validate file type (PDF, DOCX, or TXT)
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }
    
    setUploadedContract(file);
    
    // Read file as text or base64 depending on file type
    const reader = new FileReader();
    
    if (file.type === 'text/plain') {
      reader.onload = () => {
        setContractText(reader.result as string);
      };
      reader.readAsText(file);
    } else {
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setContractBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset file upload
  const resetFileUpload = () => {
    setUploadedContract(null);
    setContractText('');
    setContractBase64(null);
    setAnalysisResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // API-based contract analysis functionality
  const analyzeContract = async () => {
    if (!uploadedContract) {
      toast({
        title: "No Contract Selected",
        description: "Please upload a contract document first.",
        variant: "destructive"
      });
      return;
    }
    
    if (isApiAvailable === false) {
      toast({
        title: "AI Analysis Unavailable",
        description: "The contract analysis API is currently unavailable.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // For demonstration purposes, use a sample contract ID
      // In a real application, you would first upload the contract to get a contract ID
      const contractId = 1;
      
      const response = await apiRequest('POST', '/api/contract-analysis/comprehensive', {
        contractId,
        contractText,
        base64Data: contractBase64
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze contract');
      }
      
      const data: AnalysisResponse = await response.json();
      setAnalysisResults(data.analysis);
      
      toast({
        title: "Analysis Complete",
        description: "Contract analysis completed successfully.",
      });
    } catch (error) {
      console.error('Contract analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during analysis.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
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
                      {/* API status indicator */}
                      {isApiAvailable !== null && (
                        <div className="mb-4">
                          <Alert variant={isApiAvailable ? "default" : "destructive"}>
                            <div className="flex items-center">
                              {isApiAvailable ? (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                              ) : (
                                <AlertCircle className="h-4 w-4 mr-2" />
                              )}
                              <AlertTitle>
                                {isApiAvailable ? "AI Analysis Available" : "AI Analysis Unavailable"}
                              </AlertTitle>
                            </div>
                            <AlertDescription>
                              {isApiAvailable 
                                ? "The contract analysis service is connected and ready." 
                                : "Unable to connect to the contract analysis service. Please try again later."}
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                
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
                            <input 
                              id="contract-upload" 
                              type="file" 
                              ref={fileInputRef}
                              className="hidden" 
                              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                              onChange={handleFileUpload} 
                            />
                          </label>
                        </div>
                      )}
                      
                      {uploadedContract && !analysisResults && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm">{uploadedContract.name}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={resetFileUpload}>
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
                          className="space-y-8"
                        >
                          {/* Contract Summary Section */}
                          <div>
                            <h3 className="text-base font-medium text-primary mb-4">Contract Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Contract Type:</span>
                                  <span className="text-sm font-medium">{analysisResults.summary.contractType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Contract Value:</span>
                                  <span className="text-sm font-medium">${analysisResults.summary.contractValue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Effective Date:</span>
                                  <span className="text-sm font-medium">{new Date(analysisResults.summary.effectiveDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Termination Date:</span>
                                  <span className="text-sm font-medium">{new Date(analysisResults.summary.terminationDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Parties:</span>
                                  <span className="text-sm font-medium">{analysisResults.summary.parties.join(", ")}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Payment Terms:</span>
                                  <span className="text-sm font-medium">{analysisResults.summary.paymentTerms}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Governing Law:</span>
                                  <span className="text-sm font-medium">{analysisResults.summary.governingLaw}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Notice Period:</span>
                                  <span className="text-sm font-medium">{analysisResults.summary.noticeRequirements}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* IFRS 15 Compliance Section */}
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-base font-medium text-primary">IFRS 15/ASC 606 Compliance</h3>
                              <Badge variant={
                                analysisResults.complianceAnalysis.ifrs15Compliance.score > 80 
                                  ? "outline" 
                                  : analysisResults.complianceAnalysis.ifrs15Compliance.score > 60 
                                    ? "default" 
                                    : "destructive"
                              }>
                                Compliance Score: {analysisResults.complianceAnalysis.ifrs15Compliance.score}/100
                              </Badge>
                            </div>
                            
                            {/* Compliance Issues */}
                            {analysisResults.complianceAnalysis.ifrs15Compliance.issues.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm text-primary mb-2">Compliance Issues</h4>
                                <div className="space-y-2">
                                  {analysisResults.complianceAnalysis.ifrs15Compliance.issues.map((issue, index) => (
                                    <Alert key={index} variant="destructive">
                                      <AlertTitle>{issue.area}</AlertTitle>
                                      <AlertDescription className="flex flex-col gap-1">
                                        <span>{issue.description}</span>
                                        <span className="text-xs font-medium text-primary-foreground">Recommendation: {issue.recommendation}</span>
                                      </AlertDescription>
                                    </Alert>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Compliance Strengths */}
                            {analysisResults.complianceAnalysis.ifrs15Compliance.strengths.length > 0 && (
                              <div>
                                <h4 className="text-sm text-primary mb-2">Compliance Strengths</h4>
                                <ul className="space-y-1 list-disc pl-5">
                                  {analysisResults.complianceAnalysis.ifrs15Compliance.strengths.map((strength, index) => (
                                    <li key={index} className="text-sm text-neutral">{strength}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          {/* Risk Analysis Section */}
                          <div>
                            <h3 className="text-base font-medium text-primary mb-4">Risk Analysis</h3>
                            <div className="space-y-3">
                              {analysisResults.risks.map((risk, index) => (
                                <Alert key={index} variant={
                                  risk.severity === 'critical' ? "destructive" :
                                  risk.severity === 'high' ? "destructive" :
                                  risk.severity === 'medium' ? "default" : "outline"
                                }>
                                  <AlertTitle>{risk.category} Risk - {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}</AlertTitle>
                                  <AlertDescription className="flex flex-col gap-1">
                                    <span>{risk.description}</span>
                                    <span className="text-xs italic mt-1">Clause: {risk.clause}</span>
                                    {risk.mitigation && (
                                      <span className="text-xs font-medium mt-1">Mitigation: {risk.mitigation}</span>
                                    )}
                                  </AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          </div>
                          
                          {/* Revenue Recognition Summary */}
                          <div>
                            <h3 className="text-base font-medium text-primary mb-4">Revenue Recognition</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Total Value:</span>
                                  <span className="text-sm font-medium">${analysisResults.revenueSummary.totalValue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Recognition Pattern:</span>
                                  <span className="text-sm font-medium">{analysisResults.revenueSummary.recognitionPattern}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Special Considerations */}
                            {analysisResults.revenueSummary.specialConsiderations.length > 0 && (
                              <div className="mb-3">
                                <h4 className="text-sm text-primary mb-2">Special Considerations</h4>
                                <ul className="space-y-1 list-disc pl-5">
                                  {analysisResults.revenueSummary.specialConsiderations.map((consideration, index) => (
                                    <li key={index} className="text-sm text-neutral">{consideration}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Variable Components */}
                            {analysisResults.revenueSummary.variableComponents.length > 0 && (
                              <div>
                                <h4 className="text-sm text-primary mb-2">Variable Components</h4>
                                <div className="space-y-2">
                                  {analysisResults.revenueSummary.variableComponents.map((component, index) => (
                                    <div key={index} className="bg-secondary/20 p-3 rounded-md">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{component.description}</span>
                                        <span className="text-sm">${component.estimatedValue.toLocaleString()}</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{component.contingencies}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Opportunities Section */}
                          {analysisResults.opportunities.length > 0 && (
                            <div>
                              <h3 className="text-base font-medium text-primary mb-4">Opportunities</h3>
                              <div className="space-y-3">
                                {analysisResults.opportunities.map((opportunity, index) => (
                                  <Alert key={index} variant="default" className="border-green-500">
                                    <AlertTitle>{opportunity.category} - {opportunity.impact.charAt(0).toUpperCase() + opportunity.impact.slice(1)} Impact</AlertTitle>
                                    <AlertDescription className="flex flex-col gap-1">
                                      <span>{opportunity.description}</span>
                                      {opportunity.clause && (
                                        <span className="text-xs italic mt-1">Clause: {opportunity.clause}</span>
                                      )}
                                      {opportunity.recommendation && (
                                        <span className="text-xs font-medium mt-1">Recommendation: {opportunity.recommendation}</span>
                                      )}
                                    </AlertDescription>
                                  </Alert>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={resetFileUpload}>
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