import React, { useState, useRef } from 'react';
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
import { Contract, insertContractSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { 
  CalendarIcon, 
  FileTextIcon, 
  PlusIcon, 
  SearchIcon, 
  FileUpIcon, 
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Define a schema that accepts either Date objects or ISO strings
const dateSchema = z.union([
  z.date(),
  z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date string format",
  }),
]);

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Contract name must be at least 2 characters.",
  }),
  contractNumber: z.string().min(2, {
    message: "Contract number is required.",
  }),
  clientName: z.string().min(2, {
    message: "Client name is required.",
  }),
  startDate: dateSchema.refine(val => Boolean(val), {
    message: "Start date is required.",
  }),
  endDate: dateSchema.optional(),
  value: z.coerce.number().min(1, {
    message: "Value must be at least 1.",
  }),
  status: z.string(),
});

export default function Contracts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUploadStatus, setFileUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [extractedData, setExtractedData] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: contracts, isLoading } = useQuery<Contract[]>({
    queryKey: ['/api/contracts'],
  });
  
  const filteredContracts = contracts?.filter(contract => 
    contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      contractNumber: "",
      clientName: "",
      startDate: new Date(),
      status: "draft",
      value: 0,
    },
  });
  
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
  
  const handleContractFile = async (file: File) => {
    setUploadedFile(file);
    setFileUploadStatus('uploading');
    
    try {
      // Read the file content
      const fileText = await readFileAsText(file);
      
      // Extract contract data using OpenAI
      const response = await fetch('/api/contracts/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: fileText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract contract data');
      }
      
      const extractedData = await response.json();
      setExtractedData(extractedData);
      
      // Update form with extracted data
      form.setValue('name', extractedData.name);
      form.setValue('clientName', extractedData.clientName);
      form.setValue('contractNumber', extractedData.contractNumber);
      form.setValue('startDate', extractedData.startDate);
      form.setValue('endDate', extractedData.endDate);
      form.setValue('value', extractedData.value);
      
      setFileUploadStatus('success');
      toast({
        title: "Contract analyzed with AI",
        description: "Contract details have been extracted and populated in the form.",
      });
    } catch (error) {
      console.error('Error extracting contract data:', error);
      setFileUploadStatus('error');
      toast({
        title: "Extraction failed",
        description: "Failed to extract contract data. Please enter details manually.",
        variant: "destructive",
      });
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
  
  const createContractMutation = useMutation({
    mutationFn: async (values: any) => {
      return apiRequest('POST', '/api/contracts', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      setIsDialogOpen(false);
      form.reset();
      setUploadedFile(null);
      setFileUploadStatus('idle');
      setExtractedData(null);
      toast({
        title: "Contract created",
        description: "The contract has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create contract",
        description: error instanceof Error ? error.message : "An error occurred while creating the contract.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: z.infer<typeof FormSchema>) {
    // Format dates to ISO strings for API submission
    const formattedValues = {
      ...values,
      // Convert to ISO strings for API
      startDate: values.startDate instanceof Date ? values.startDate.toISOString() : values.startDate,
      endDate: values.endDate instanceof Date ? values.endDate.toISOString() : values.endDate,
    };
    createContractMutation.mutate(formattedValues);
  }
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Contracts" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">All Contracts</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search contracts..."
                        className="w-[200px] sm:w-[300px] pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          New Contract
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Create New Contract</DialogTitle>
                          <DialogDescription>
                            Upload a contract file or enter details manually to create a new contract.
                          </DialogDescription>
                        </DialogHeader>
                        
                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileInputChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                        />
                        
                        {/* Contract file upload area */}
                        <div 
                          className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors cursor-pointer ${
                            isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {fileUploadStatus === 'idle' && (
                            <>
                              <FileUpIcon className="h-8 w-8 mx-auto mb-2 text-neutral/50" />
                              <p className="text-sm text-neutral/70">
                                Drag & drop your contract document here, or click to browse
                              </p>
                              <p className="text-xs text-neutral/50 mt-1">
                                Supported formats: PDF, DOC, DOCX, TXT
                              </p>
                            </>
                          )}
                          
                          {fileUploadStatus === 'uploading' && (
                            <div className="py-2">
                              <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent mx-auto mb-2"></div>
                              <p className="text-sm text-blue-600">Analyzing contract document...</p>
                            </div>
                          )}
                          
                          {fileUploadStatus === 'success' && (
                            <div className="py-2">
                              <div className="flex items-center justify-center mb-2">
                                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                              </div>
                              <p className="text-sm text-green-600 font-medium">{uploadedFile?.name}</p>
                              <p className="text-xs text-neutral/70 mt-1">
                                Contract details extracted and populated below
                              </p>
                            </div>
                          )}
                          
                          {fileUploadStatus === 'error' && (
                            <div className="py-2">
                              <div className="flex items-center justify-center mb-2">
                                <AlertCircleIcon className="h-8 w-8 text-red-500" />
                              </div>
                              <p className="text-sm text-red-600">Error analyzing document</p>
                              <p className="text-xs text-neutral/70 mt-1">
                                Please try again or enter details manually
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Contract Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="SaaS License Agreement" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="contractNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Contract Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="CT-2023-0001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name="clientName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Client Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Acme Corporation" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Start Date</FormLabel>
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
                                name="endDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>End Date (Optional)</FormLabel>
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
                                          selected={field.value || undefined}
                                          onSelect={field.onChange}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Contract Value ($)</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} />
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
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
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
                                disabled={createContractMutation.isPending}
                              >
                                {createContractMutation.isPending ? (
                                  <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                  </div>
                                ) : "Create Contract"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Contract</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              <div className="flex justify-center">
                                <svg className="animate-spin h-5 w-5 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredContracts?.length ? (
                          filteredContracts.map((contract) => (
                            <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/50">
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-2">
                                  <FileTextIcon className="h-5 w-5 text-secondary" />
                                  <div>
                                    <div>{contract.name}</div>
                                    <div className="text-xs text-muted-foreground">#{contract.contractNumber}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{contract.clientName}</TableCell>
                              <TableCell>{formatDate(contract.startDate)}</TableCell>
                              <TableCell>{formatDate(contract.endDate)}</TableCell>
                              <TableCell>{formatCurrency(contract.value)}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                                  {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No contracts found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
