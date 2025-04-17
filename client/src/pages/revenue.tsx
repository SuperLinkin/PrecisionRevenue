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
import { Contract, RevenueRecord } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, DollarSign, PlusIcon } from 'lucide-react';
import { RevenueChart } from '@/components/ui/revenue-chart';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

export default function Revenue() {
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: contracts, isLoading: contractsLoading } = useQuery<Contract[]>({
    queryKey: ['/api/contracts'],
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
                  <CardTitle className="text-xl font-bold">Select Contract</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={selectedContractId || ""} 
                    onValueChange={setSelectedContractId}
                  >
                    <SelectTrigger className="w-full">
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
                </CardContent>
              </Card>
              
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
