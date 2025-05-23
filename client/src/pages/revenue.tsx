import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Contract, RevenueRecord } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, DollarSign, PlusIcon, FileUp, SendIcon, Bot, AlertCircle, RefreshCw } from 'lucide-react';
import { RevenueChart } from '@/components/ui/revenue-chart';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { RevenueCalculator } from '@/components/revenue-recognition/RevenueCalculator';

const FormSchema = z.object({
  contractId: z.string().min(1, {
    message: "Contract is required.",
  }),
  amount: z.coerce.number().min(1, {
    message: "Amount must be at least 1.",
  }),
  recognitionDate: z.date({
    required_error: "Recognition date is required.",
  }),
  description: z.string().optional(),
  status: z.string().min(1, {
    message: "Status is required.",
  }),
});

// Types for chat messages
interface PerformanceObligation {
  name: string;
  isDistinct: boolean;
  deliveryTiming: 'point' | 'over-time';
  suggestedSSP: number;
}

interface TerminationClauseImpact {
  refundObligation: boolean;
  terminationRisk: string;
}

interface RevenueScheduleItem {
  month: string; // Format: YYYY-MM
  amount: number;
}

interface REMYAnalysisResult {
  contractName?: string;
  contractValue?: number;
  contractTermMonths?: number;
  performanceObligations?: PerformanceObligation[];
  revenueRecognitionSchedule?: RevenueScheduleItem[];
  terminationClauseImpact?: TerminationClauseImpact;
  financingComponent?: boolean;
  auditSummary?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  structuredData?: REMYAnalysisResult; // For REMY's structured responses
}

// Helper function to render a revenue recognition schedule
const renderRevenueSchedule = (schedule: RevenueScheduleItem[]) => {
  if (!schedule || schedule.length === 0) return null;
  
  return (
    <div className="mt-4 mb-4">
      <h4 className="text-sm font-semibold mb-2">Revenue Recognition Schedule</h4>
      <div className="bg-white rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.month}</TableCell>
                <TableCell>{formatCurrency(item.amount)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-gray-50">
              <TableCell className="font-medium">Total</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(schedule.reduce((sum, item) => sum + item.amount, 0))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Helper function to render performance obligations
const renderPerformanceObligations = (obligations: PerformanceObligation[]) => {
  if (!obligations || obligations.length === 0) return null;
  
  return (
    <div className="mt-4 mb-4">
      <h4 className="text-sm font-semibold mb-2">Performance Obligations</h4>
      <ul className="list-disc pl-5 space-y-2">
        {obligations.map((po, index) => (
          <li key={index} className="text-sm">
            <span className="font-medium">{po.name}</span>
            <div className="text-xs text-gray-600 mt-1">
              <div>Distinct: {po.isDistinct ? 'Yes' : 'No'}</div>
              <div>Delivery: {po.deliveryTiming === 'point' ? 'Point in time' : 'Over time'}</div>
              <div>Standalone Price: {formatCurrency(po.suggestedSSP)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Helper function to render termination clause impact
const renderTerminationClause = (impact: TerminationClauseImpact) => {
  if (!impact) return null;
  
  return (
    <div className="mt-4 mb-4">
      <h4 className="text-sm font-semibold mb-2">Termination Clause Impact</h4>
      <div className="bg-white rounded-md border p-3 text-sm">
        <div className="mb-1">
          <span className="font-medium">Refund Obligation: </span>
          {impact.refundObligation ? 'Yes' : 'No'}
        </div>
        <div>
          <span className="font-medium">Risk Assessment: </span>
          {impact.terminationRisk}
        </div>
      </div>
    </div>
  );
};

// Helper function to render audit summary
const renderAuditSummary = (summary: string, financingComponent: boolean) => {
  if (!summary) return null;
  
  return (
    <div className="mt-4 mb-4">
      <h4 className="text-sm font-semibold mb-2">Audit Summary</h4>
      <div className="bg-white rounded-md border p-3 text-sm">
        <div className="mb-2">
          <span className="font-medium">Significant Financing Component: </span>
          {financingComponent ? 'Yes' : 'No'}
        </div>
        <div>
          <span className="font-medium">Audit Notes: </span>
          {summary}
        </div>
      </div>
    </div>
  );
};

// Function to check if content contains JSON and try to parse REMY analysis
const tryParseREMYAnalysis = (content: string): REMYAnalysisResult | null => {
  try {
    // First check if the whole content is JSON
    try {
      const data = JSON.parse(content);
      if (data.performanceObligations || data.revenueRecognitionSchedule) {
        return data as REMYAnalysisResult;
      }
    } catch (wholeJsonError) {
      // Not a full JSON object, try to extract JSON from text
    }
    
    // Look for what might be a JSON structure embedded in the text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      try {
        const data = JSON.parse(jsonStr);
        
        // Verify this has the expected REMY fields
        if (data.performanceObligations || data.revenueRecognitionSchedule) {
          return data as REMYAnalysisResult;
        }
      } catch (embeddedJsonError) {
        console.error("Failed to parse embedded JSON:", embeddedJsonError);
      }
    }
    
    // Check for fallback indicators
    if (content.toLowerCase().includes("would you like me to")) {
      console.warn("Detected incomplete contract analysis request");
      // We'll handle this in the UI
      return null;
    }
    
    return null;
  } catch (err) {
    console.error("Failed to parse REMY analysis:", err);
    return null;
  }
};

export default function Revenue() {
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am REMY, your Revenue Management Assistant. I can help you analyze contracts, identify revenue recognition points, and provide IFRS 15/ASC 606 guidance. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Load last contract analysis from localStorage on component mount
  useEffect(() => {
    try {
      // Get the last analyzed contract info
      const lastAnalysisStr = localStorage.getItem('lastContractAnalysis');
      if (lastAnalysisStr) {
        const lastAnalysis = JSON.parse(lastAnalysisStr);
        
        // Create a dummy File object since we can't store File objects in localStorage
        // For a real app, this would be handled differently, perhaps with session storage
        if (lastAnalysis.fileName) {
          const dummyFile = new File(["dummy content"], lastAnalysis.fileName, {
            type: "application/pdf"
          });
          
          // Set the contract file in state so questions can be answered about it
          setContractFile(dummyFile);
          
          // Add a message indicating we've loaded a previously analyzed contract
          setChatMessages(prev => {
            // Check if we already have a welcome message
            if (prev.length === 1 && prev[0].role === 'assistant') {
              return [
                ...prev,
                {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: `I've loaded your previously analyzed contract "${lastAnalysis.fileName}". You can ask me questions about it or upload a new contract.`,
                  timestamp: new Date()
                }
              ];
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.error("Error loading from localStorage:", err);
    }
  }, []);
  
  const { data: contracts, isLoading: contractsLoading } = useQuery<Contract[]>({
    queryKey: ['/api/contracts'],
  });
  
  const { data: companies } = useQuery<any[]>({
    queryKey: ['/api/companies'],
  });
  
  const { data: revenueRecords, isLoading: revenueLoading } = useQuery<RevenueRecord[]>({
    queryKey: ['/api/revenue-records', selectedContractId],
    queryFn: async () => {
      if (!selectedContractId) return [];
      const res = await fetch(`/api/revenue-records?contractId=${selectedContractId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch revenue records');
      return res.json();
    },
    enabled: !!selectedContractId,
  });
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contractId: "",
      amount: 0,
      recognitionDate: new Date(),
      description: "",
      status: "pending",
    },
  });
  
  const createRevenueRecordMutation = useMutation({
    mutationFn: async (values: z.infer<typeof FormSchema>) => {
      return apiRequest('POST', '/api/revenue-records', {
        ...values,
        contractId: parseInt(values.contractId),
      });
    },
    onSuccess: () => {
      if (selectedContractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/revenue-records', selectedContractId] });
      }
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Revenue record created",
        description: "The revenue record has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create revenue record",
        description: error instanceof Error ? error.message : "An error occurred while creating the revenue record.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: z.infer<typeof FormSchema>) {
    createRevenueRecordMutation.mutate(values);
  }
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleContractFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleContractFile(e.target.files[0]);
    }
  };
  
  // Helper function to read a file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };
  
  // Helper function to read a file as Base64-encoded string (better for PDFs and binary formats)
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Extract the base64 content without the data URL prefix
        const base64String = reader.result as string;
        const contentStart = base64String.indexOf('base64,') + 'base64,'.length;
        const extractedBase64 = base64String.substring(contentStart);
        resolve(extractedBase64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleContractFile = async (file: File) => {
    console.log("Processing new contract file:", file.name);
    
    // Set contract file in state
    setContractFile(file);
    
    // Store the file in local storage for persistence
    // Note: In a real app, we might use a more robust solution
    try {
      // Save filename (we can't store the actual File object)
      localStorage.setItem('currentContractFileName', file.name);
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
    
    // Add a loading message
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Analyzing "${file.name}". Please wait a moment...`,
        timestamp: new Date()
      }
    ]);
    
    try {
      // Only accept PDF files
      if (file.type === 'application/pdf') {
        console.log("PDF file detected, attempting to extract text...");
        
        // Get file content as base64
        const base64Data = await readFileAsBase64(file);
        console.log("Successfully read file as base64, length:", base64Data.length);
        
        // For now, we don't have a proper PDF-to-text conversion library,
        // but we still send the file name for template-based analysis
        const response = await fetch('/api/contracts/extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // The server will use this as a hint if it supports PDF processing
            base64Data: base64Data, 
            text: `Contract from ${file.name}`, // Placeholder text with file name
            fileName: file.name
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to extract contract data');
        }
        
        const contractData = await response.json();
        
        // Format the contract value for display
        const formattedValue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(contractData.value);
        
        // Calculate contract duration
        const startDate = new Date(contractData.startDate);
        const endDate = contractData.endDate ? new Date(contractData.endDate) : null;
        const durationMonths = endDate ? 
          Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) : 
          12;
        
        // Update UI with contract info
        setChatMessages(prev => [
          // Remove the loading message
          ...prev.slice(0, -1),
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `I've analyzed "${file.name}" and extracted the key contract details. This appears to be a ${contractData.name} between Precision Revenue Automation and ${contractData.clientName} valued at ${formattedValue}${endDate ? ` over ${durationMonths} months` : ''}. The contract includes payment terms of quarterly installments.\n\nWould you like me to suggest a revenue recognition schedule based on IFRS 15/ASC 606 guidelines?`,
            timestamp: new Date()
          }
        ]);
        
        // Save last successful analysis in localStorage for persistence
        try {
          localStorage.setItem('lastContractAnalysis', JSON.stringify({
            fileName: file.name,
            contractType: contractData.name,
            clientName: contractData.clientName,
            value: contractData.value
          }));
        } catch (err) {
          console.error("Error saving analysis to localStorage:", err);
        }
        
        toast({
          title: "Contract analysis complete",
          description: `${file.name} has been analyzed. Ask REMY for details or guidance.`,
        });
      } else {
        // For non-PDF files, show error
        setChatMessages(prev => [
          // Remove the loading message
          ...prev.slice(0, -1),
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `I can only analyze PDF contract files. The file you uploaded is ${file.type}. Please upload a PDF contract document for analysis.`,
            timestamp: new Date()
          }
        ]);
        
        toast({
          title: "Unsupported file format",
          description: "We currently only support PDF files for AI analysis. Please upload a PDF.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error extracting contract data:', error);
      
      // Remove the loading message and add an error message
      setChatMessages(prev => [
        ...prev.slice(0, -1),
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I had trouble analyzing "${file.name}". Please try again or upload a different contract file.`,
          timestamp: new Date()
        }
      ]);
      
      toast({
        title: "Analysis failed",
        description: "Failed to extract contract data. Please try another PDF or try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const userQuery = currentMessage;
    setCurrentMessage('');
    
    // Add a typing indicator
    setChatMessages(prev => [
      ...prev,
      {
        id: 'typing',
        role: 'assistant',
        content: 'Typing...',
        timestamp: new Date()
      }
    ]);
    
    try {
      let response;
      
      // For debugging
      console.log("Current contract file:", contractFile ? contractFile.name : "No file");
      
      // If a contract file has been uploaded, use the AI to answer questions about it
      if (contractFile) {
        console.log("Processing contract file:", contractFile.name, contractFile.type);
        
        // Only process PDF files
        if (contractFile.type === 'application/pdf') {
          // Get the content as base64 for future use
          const base64Data = await readFileAsBase64(contractFile);
          
          // Send the file name and query to the backend for analysis
          response = await fetch('/api/contracts/ask', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              question: userQuery,
              fileName: contractFile.name,
              // Send the base64 data for more accurate processing
              base64Data: base64Data,
              // Include our latest mock contract template
              contractTemplate: true
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to get AI response');
          }
          
          const result = await response.json();
          
          // Remove the typing indicator and add the AI response
          // Try to parse any structured REMY data from the response
          let structuredData = null;
          let displayAnswer = result.answer;
          
          try {
            if (result.structuredData) {
              // If the server already separated the structured data
              structuredData = result.structuredData;
              console.log("Using server-provided structured data:", structuredData);
            } else {
              // Try to extract structured data from the answer text
              structuredData = tryParseREMYAnalysis(result.answer);
              
              if (structuredData) {
                console.log("Successfully extracted structured data from response text");
              }
            }
            
            // Handle fallback for "Would you like me to..." responses
            if (!structuredData && displayAnswer.toLowerCase().includes("would you like me to")) {
              displayAnswer = "REMY detected incomplete contract details. Please re-upload a full SaaS contract.";
              
              // Show an error toast to provide more context
              toast({
                title: "Insufficient Contract Information",
                description: "The contract details appear to be incomplete. Please upload a more complete contract document for proper IFRS 15/ASC 606 analysis.",
                variant: "destructive"
              });
            }
          } catch (err) {
            console.error("Error parsing structured data:", err);
          }
          
          setChatMessages(prev => [
            ...prev.filter(msg => msg.id !== 'typing'),
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: displayAnswer,
              timestamp: new Date(),
              structuredData: structuredData
            }
          ]);
        } else {
          // For non-PDF files, provide a helpful message
          setChatMessages(prev => [
            ...prev.filter(msg => msg.id !== 'typing'),
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: `I can only analyze PDF contract files. The file you uploaded is ${contractFile.type}. Please upload a PDF contract document for analysis.`,
              timestamp: new Date()
            }
          ]);
        }
      } else {
        console.log("No contract file found, providing generic response");
        
        // No contract uploaded yet, provide generic responses
        let responseContent = '';
        
        if (userQuery.toLowerCase().includes('generate')) {
          responseContent = "To generate a revenue recognition schedule, please upload a contract document first so I can analyze it. Would you like to upload a contract now?";
        } else if (userQuery.toLowerCase().includes('explain') || userQuery.toLowerCase().includes('ifrs') || userQuery.toLowerCase().includes('asc')) {
          responseContent = "Under IFRS 15/ASC 606, revenue is recognized when control of goods or services transfers to the customer. For SaaS subscriptions, this typically means recognizing revenue over time as the service is provided. Would you like me to explain more specific aspects of revenue recognition for a particular contract? If so, please upload the contract first.";
        } else {
          responseContent = "I can help with contract analysis, revenue recognition guidance, and creating revenue schedules. To get started, please upload a contract using the upload button or drag and drop area.";
        }
        
        // Remove the typing indicator and add the response
        setChatMessages(prev => [
          ...prev.filter(msg => msg.id !== 'typing'),
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: responseContent,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Remove the typing indicator and add an error message
      setChatMessages(prev => [
        ...prev.filter(msg => msg.id !== 'typing'),
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm sorry, I encountered an error while processing your request. Please try again or upload a different contract file.",
          timestamp: new Date()
        }
      ]);
    }
  };
  
  const generateRevenue = () => {
    if (!selectedContractId || !selectedCompanyId) {
      toast({
        title: "Selection required",
        description: "Please select both a company and a contract first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsGenerating(false);
      
      toast({
        title: "Revenue generated",
        description: "Revenue recognition schedule has been successfully generated based on the selected contract.",
      });
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/revenue-records', selectedContractId] });
    }, 2000);
  };
  
  const selectedContract = contracts?.find(c => c.id.toString() === selectedContractId);
  // Convert string amounts to numbers for calculations
  const totalRecognized = revenueRecords?.reduce((sum, record) => sum + parseFloat(record.amount), 0) || 0;
  const remainingToRecognize = selectedContract ? selectedContract.value - totalRecognized : 0;
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Revenue Recognition" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {/* Contract Selection */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold">Generate Revenue</CardTitle>
                  <CardDescription>
                    Select company and contract to generate revenue recognition schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Company Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral mb-1">Company</label>
                      <Select 
                        value={selectedCompanyId || ""} 
                        onValueChange={setSelectedCompanyId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                        <SelectContent>
                          {!companies ? (
                            <div className="p-2 text-center">Loading companies...</div>
                          ) : companies.length > 0 ? (
                            companies.map(company => (
                              <SelectItem key={company.id} value={company.id.toString()}>
                                {company.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-center">No companies available</div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Contract Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral mb-1">Contract</label>
                      <Select 
                        value={selectedContractId || ""} 
                        onValueChange={setSelectedContractId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a contract" />
                        </SelectTrigger>
                        <SelectContent>
                          {contractsLoading ? (
                            <div className="p-2 text-center">Loading contracts...</div>
                          ) : contracts?.length ? (
                            contracts.map(contract => (
                              <SelectItem key={contract.id} value={contract.id.toString()}>
                                {contract.name} ({contract.clientName})
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-center">No contracts available</div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      onClick={generateRevenue}
                      disabled={!selectedContractId || !selectedCompanyId || isGenerating}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Generate Revenue Schedule
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowChat(!showChat)}
                      className="flex items-center"
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      {showChat ? "Hide REMY" : "Chat with REMY"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* REMY Chat Interface */}
              <AnimatePresence>
                {showChat && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    <Card>
                      <CardHeader className="pb-2 flex flex-row justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Bot className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">REMY</CardTitle>
                            <CardDescription>Revenue Management Assistant</CardDescription>
                          </div>
                        </div>
                        
                        {/* Contract File Upload */}
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileInputChange}
                            className="hidden"
                            accept=".pdf"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs"
                          >
                            <FileUp className="h-3 w-3 mr-1" />
                            Upload Contract
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {/* Drag and Drop Zone */}
                        <div 
                          className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors ${
                            isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <FileUp className="h-8 w-8 mx-auto mb-2 text-neutral/50" />
                          <p className="text-sm text-neutral/70">
                            Drag & drop your contract document here, or click the upload button above
                          </p>
                          <p className="text-xs text-neutral/50 mt-1">
                            Supported formats: PDF only
                          </p>
                        </div>
                        
                        {/* Chat Messages */}
                        <div 
                          ref={chatContainerRef}
                          className="h-64 overflow-y-auto p-3 mb-4 bg-gray-50 rounded-lg space-y-4"
                        >
                          {chatMessages.map(message => (
                            <div 
                              key={message.id}
                              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                  message.role === 'assistant' 
                                    ? 'bg-white border border-gray-200 text-gray-800' 
                                    : 'bg-blue-600 text-white'
                                }`}
                              >
                                {/* Regular text content */}
                                <p className="text-sm">{message.content}</p>
                                
                                {/* If there's structured data, or if we can extract it from the content */}
                                {message.role === 'assistant' && (
                                  <>
                                    {(() => {
                                      // Try to parse JSON if it hasn't been parsed already
                                      const structuredData = message.structuredData || 
                                        (message.content.includes('{') && tryParseREMYAnalysis(message.content));
                                        
                                      if (structuredData) {
                                        return (
                                          <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="text-xs font-medium text-blue-600 mb-2">
                                              IFRS 15/ASC 606 Analysis
                                            </div>
                                            
                                            {/* Contract Summary */}
                                            {structuredData.contractName && (
                                              <div className="mb-3">
                                                <div className="text-sm font-medium">{structuredData.contractName}</div>
                                                {structuredData.contractValue && (
                                                  <div className="text-sm">
                                                    Value: {formatCurrency(structuredData.contractValue)}
                                                    {structuredData.contractTermMonths && 
                                                      ` over ${structuredData.contractTermMonths} months`}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                            
                                            {/* Performance Obligations */}
                                            {structuredData.performanceObligations && 
                                              renderPerformanceObligations(structuredData.performanceObligations)}
                                            
                                            {/* Revenue Recognition Schedule */}
                                            {structuredData.revenueRecognitionSchedule && 
                                              renderRevenueSchedule(structuredData.revenueRecognitionSchedule)}
                                            
                                            {/* Termination Clause Impact */}
                                            {structuredData.terminationClauseImpact && 
                                              renderTerminationClause(structuredData.terminationClauseImpact)}
                                            
                                            {/* Audit Summary */}
                                            {structuredData.auditSummary && 
                                              renderAuditSummary(
                                                structuredData.auditSummary, 
                                                !!structuredData.financingComponent
                                              )}
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </>
                                )}
                                
                                <p className="text-xs mt-1 opacity-60">
                                  {format(message.timestamp, 'h:mm a')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Chat Input */}
                        <form onSubmit={handleChatSubmit} className="flex space-x-2">
                          <Input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Ask REMY about revenue recognition..."
                            className="flex-1"
                          />
                          <Button type="submit" disabled={!currentMessage.trim()}>
                            <SendIcon className="h-4 w-4" />
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {selectedContractId && (
                <>
                  {/* Contract Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center">
                          <div className="bg-secondary/10 rounded-md p-3">
                            <DollarSign className="h-6 w-6 text-secondary" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-neutral truncate">
                                Total Contract Value
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-primary">
                                  {selectedContract ? formatCurrency(selectedContract.value) : '-'}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center">
                          <div className="bg-accent/10 rounded-md p-3">
                            <DollarSign className="h-6 w-6 text-accent" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-neutral truncate">
                                Recognized Revenue
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-primary">
                                  {formatCurrency(totalRecognized)}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center">
                          <div className="bg-secondary/10 rounded-md p-3">
                            <DollarSign className="h-6 w-6 text-secondary" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-neutral truncate">
                                Remaining to Recognize
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-primary">
                                  {formatCurrency(remainingToRecognize)}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* IFRS 15/ASC 606 Revenue Recognition */}
                  {selectedContract && (
                    <div className="mb-6">
                      <RevenueCalculator 
                        contractId={parseInt(selectedContractId as string)} 
                        contractName={selectedContract.name}
                        totalValue={selectedContract.value}
                      />
                    </div>
                  )}
                  
                  {/* Revenue Records Table */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-bold">Revenue Recognition Schedule</CardTitle>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Revenue Record
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Create Revenue Record</DialogTitle>
                            <DialogDescription>
                              Add a new revenue recognition entry for the selected contract.
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="contractId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Contract</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={selectedContractId || ""}
                                      value={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select contract" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {contracts?.map(contract => (
                                          <SelectItem key={contract.id} value={contract.id.toString()}>
                                            {contract.name} ({contract.clientName})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Amount ($)</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="recognitionDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Recognition Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                          >
                                            {field.value ? (
                                              format(field.value, "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Description of this revenue recognition entry"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="recognized">Recognized</SelectItem>
                                        <SelectItem value="adjusted">Adjusted</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <DialogFooter>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setIsDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  type="submit" 
                                  disabled={createRevenueRecordMutation.isPending}
                                >
                                  {createRevenueRecordMutation.isPending ? (
                                    <div className="flex items-center">
                                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Creating...
                                    </div>
                                  ) : "Create Revenue Record"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Recognition Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {revenueLoading ? (
                              <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                  <div className="flex justify-center">
                                    <svg className="animate-spin h-5 w-5 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : revenueRecords?.length ? (
                              revenueRecords.map((record) => (
                                <TableRow key={record.id}>
                                  <TableCell>{formatDate(record.recognitionDate)}</TableCell>
                                  <TableCell>{formatCurrency(record.amount)}</TableCell>
                                  <TableCell>{record.description || '-'}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                  No revenue records found for this contract.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
