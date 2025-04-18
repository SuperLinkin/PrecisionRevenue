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
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

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
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
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
  
  const handleContractFile = (file: File) => {
    setContractFile(file);
    toast({
      title: "Contract uploaded",
      description: `${file.name} has been uploaded for analysis. REMY is ready to process it.`,
    });
    
    // Simulate contract analysis response after a short delay
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I've analyzed "${file.name}" and extracted the key contract details. This appears to be a SaaS license agreement with quarterly billing cycles and a total value of $480,000 over 24 months. Would you like me to suggest a revenue recognition schedule based on IFRS 15/ASC 606 guidelines?`,
          timestamp: new Date()
        }
      ]);
    }, 2000);
  };
  
  const handleChatSubmit = (e: React.FormEvent) => {
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
    setCurrentMessage('');
    
    // Simulate REMY's response
    setTimeout(() => {
      let responseContent = '';
      
      if (currentMessage.toLowerCase().includes('generate')) {
        responseContent = "I've created a suggested revenue recognition schedule for this contract. This allocates the $480,000 evenly across 24 months at $20,000 per month, which aligns with the performance obligations identified in the contract. Would you like me to generate these revenue records in the system?";
      } else if (currentMessage.toLowerCase().includes('explain')) {
        responseContent = "Under IFRS 15/ASC 606, revenue is recognized when control of goods or services transfers to the customer. For SaaS subscriptions, this typically means recognizing revenue over time as the service is provided. Would you like me to explain more specific aspects of revenue recognition for this contract?";
      } else {
        responseContent = "I can help with contract analysis, revenue recognition guidance, and creating revenue schedules. Is there something specific about this contract you'd like me to assist with?";
      }
      
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date()
        }
      ]);
    }, 1500);
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
  const totalRecognized = revenueRecords?.reduce((sum, record) => sum + record.amount, 0) || 0;
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
                            accept=".pdf,.doc,.docx,.txt"
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
                            Supported formats: PDF, DOC, DOCX, TXT
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
                                <p className="text-sm">{message.content}</p>
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
