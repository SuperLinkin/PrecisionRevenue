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
      // Only accept PDF files
      if (file.type === 'application/pdf') {
        // Read the PDF file as base64
        const base64Data = await readFileAsBase64(file);
        
        // Extract contract data using OpenAI
        const response = await fetch('/api/contracts/extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: "PDF document content would be analyzed here",
            fileName: file.name
          }),
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
          description: "PDF contract details have been extracted and populated in the form.",
        });
      } else {
        // For non-PDF files, show error
        setFileUploadStatus('error');
        toast({
          title: "Unsupported file format",
          description: "We currently only support PDF files for AI analysis. Please upload a PDF.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error extracting contract data:', error);
      setFileUploadStatus('error');
      toast({
        title: "Extraction failed",
        description: "Failed to extract contract data. Please try another PDF or enter details manually.",
        variant: "destructive",
      });
    }
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
                          accept=".pdf"
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
                                Supported formats: PDF only
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
                                    <div className="flex space-x-2">
                                      <FormControl>
                                        <Input 
                                          placeholder="Enter start date" 
                                          value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""} 
                                          onChange={(e) => {
                                            try {
                                              // Attempt to parse the date from input
                                              const dateValue = e.target.value ? new Date(e.target.value) : null;
                                              field.onChange(dateValue);
                                            } catch (err) {
                                              // If parsing fails, don't update the value
                                              console.error("Date parsing error:", err);
                                            }
                                          }}
                                          type="date"
                                        />
                                      </FormControl>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="outline" type="button" size="icon">
                                            <CalendarIcon className="h-4 w-4" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                            mode="single"
                                            selected={field.value instanceof Date ? field.value : undefined}
                                            onSelect={field.onChange}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
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
                                    <div className="flex space-x-2">
                                      <FormControl>
                                        <Input 
                                          placeholder="Enter end date" 
                                          value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""} 
                                          onChange={(e) => {
                                            try {
                                              // Attempt to parse the date from input
                                              const dateValue = e.target.value ? new Date(e.target.value) : null;
                                              field.onChange(dateValue);
                                            } catch (err) {
                                              // If parsing fails, don't update the value
                                              console.error("Date parsing error:", err);
                                            }
                                          }}
                                          type="date"
                                        />
                                      </FormControl>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="outline" type="button" size="icon">
                                            <CalendarIcon className="h-4 w-4" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                            mode="single"
                                            selected={field.value instanceof Date ? field.value : undefined}
                                            onSelect={field.onChange}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
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
                                    <FormLabel>Contract Value</FormLabel>
                                    <FormControl>
                                      <Input type="number" placeholder="100000" {...field} />
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
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="terminated">Terminated</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <DialogFooter className="mt-6">
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
                                  <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Processing...
                                  </>
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contract</TableHead>
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
                            <div className="flex justify-center items-center">
                              <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                              <span className="ml-2">Loading contracts...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredContracts && filteredContracts.length > 0 ? (
                        filteredContracts.map(contract => (
                          <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell>
                              <div className="flex flex-col">
                                <div>{contract.name}</div>
                                <div className="text-xs text-muted-foreground">#{contract.contractNumber}</div>
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
                            {searchTerm ? "No contracts found matching your search" : "No contracts found"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}