import { useState } from 'react';
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
import { CalendarIcon, FileTextIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

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
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date().optional(),
  value: z.coerce.number().min(1, {
    message: "Value must be at least 1.",
  }),
  status: z.string(),
});

export default function Contracts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  
  const createContractMutation = useMutation({
    mutationFn: async (values: z.infer<typeof FormSchema>) => {
      return apiRequest('POST', '/api/contracts', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      setIsDialogOpen(false);
      form.reset();
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
    createContractMutation.mutate(values);
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
                            Enter the contract details below to create a new contract.
                          </DialogDescription>
                        </DialogHeader>
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
