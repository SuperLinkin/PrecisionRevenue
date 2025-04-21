import React, { useEffect, useState, useRef } from 'react';
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
import { FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
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

// API response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ApiStatusResponse {
  available: boolean;
  message?: string;
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check OpenAI API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/contract-analysis/status');
        const data: ApiStatusResponse = await response.json();
        setIsApiAvailable(!!data.available);
        
        if (!data.available) {
          setError(data.message || "The contract analysis API is currently unavailable.");
          toast({
            title: "AI Analysis Unavailable",
            description: data.message || "The contract analysis API is currently unavailable.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to check API status:", error);
        setIsApiAvailable(false);
        setError("Failed to connect to the contract analysis service.");
        toast({
          title: "AI Analysis Unavailable",
          description: "Failed to connect to the contract analysis service.",
          variant: "destructive"
        });
      }
    };
    
    checkApiStatus();
  }, [toast]);

  // Handle contract analysis
  const handleAnalyzeContract = async () => {
    if (!isApiAvailable) {
      toast({
        title: "AI Analysis Unavailable",
        description: "Please ensure the AI service is available before analyzing contracts.",
        variant: "destructive"
      });
      return;
    }

    if (!contractText && !contractBase64) {
      toast({
        title: "No Contract Data",
        description: "Please upload a contract or enter contract text before analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/contract-analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractText,
          base64Data: contractBase64
        }),
      });

      const data: ApiResponse<ContractAnalysis> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze contract');
      }

      setAnalysisResults(data.data || null);
      toast({
        title: "Analysis Complete",
        description: "Contract has been successfully analyzed.",
        variant: "default"
      });
    } catch (error) {
      console.error('Contract analysis error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during analysis');
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'An error occurred during analysis',
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setUploadedContract(file);
    setError(null);

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      setContractBase64(base64.split(',')[1]); // Remove data URL prefix

      // Read text content
      const text = await file.text();
      setContractText(text);

      toast({
        title: "File Uploaded",
        description: "Contract file has been successfully uploaded.",
        variant: "default"
      });
    } catch (error) {
      console.error('File upload error:', error);
      setError('Failed to process the uploaded file');
      toast({
        title: "Upload Failed",
        description: "Failed to process the uploaded file. Please try again.",
        variant: "destructive"
      });
      resetFileUpload();
    } finally {
      setIsLoading(false);
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
                          <label 
                            htmlFor="contract-upload" 
                            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-neutral-50 dark:hover:bg-slate-800 ${
                              isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {isLoading ? (
                                <Loader2 className="w-10 h-10 mb-3 text-secondary animate-spin" />
                              ) : (
                                <FileText className="w-10 h-10 mb-3 text-secondary" />
                              )}
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
                              disabled={isLoading || isAnalyzing} 
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
                              {isLoading && (
                                <Badge variant="outline" className="ml-2">
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  Processing
                                </Badge>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={resetFileUpload}
                              disabled={isLoading || isAnalyzing}
                            >
                              Remove
                            </Button>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleAnalyzeContract} 
                              disabled={isLoading || isAnalyzing}
                            >
                              {isAnalyzing ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Analyzing...
                                </>
                              ) : 'Analyze Contract'}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {error && (
                        <Alert variant="destructive" className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
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
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <Label>Contract Type</Label>
                                <p className="text-sm">{analysisResults.summary.contractType}</p>
                              </div>
                              <div>
                                <Label>Contract Value</Label>
                                <p className="text-sm">${analysisResults.summary.contractValue.toLocaleString()}</p>
                              </div>
                              <div>
                                <Label>Effective Date</Label>
                                <p className="text-sm">{new Date(analysisResults.summary.effectiveDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <Label>Termination Date</Label>
                                <p className="text-sm">{new Date(analysisResults.summary.terminationDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Risk Analysis Section */}
                          <div>
                            <h3 className="text-base font-medium text-primary mb-4">Risk Analysis</h3>
                            <div className="space-y-4">
                              {analysisResults.risks.map((risk, index) => (
                                <div key={index} className="p-4 rounded-lg border">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{risk.category}</span>
                                    <Badge 
                                      variant={
                                        risk.severity === 'critical' ? 'destructive' :
                                        risk.severity === 'high' ? 'destructive' :
                                        risk.severity === 'medium' ? 'secondary' :
                                        'default'
                                      }
                                    >
                                      {risk.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{risk.description}</p>
                                  {risk.mitigation && (
                                    <p className="text-sm mt-2">
                                      <span className="font-medium">Mitigation: </span>
                                      {risk.mitigation}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Add more analysis sections as needed */}
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