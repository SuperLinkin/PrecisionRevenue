import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Form schema for performance obligation
const poFormSchema = z.object({
  contractId: z.number(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  standaloneSellingPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  allocationPercentage: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
  recognitionMethod: z.enum(['point_in_time', 'over_time', 'output_method', 'input_method'])
});

// Form schema for transaction price adjustment
const adjustmentFormSchema = z.object({
  contractId: z.number(),
  adjustmentType: z.enum([
    'variable_consideration', 
    'significant_financing', 
    'non_cash', 
    'payable_to_customer', 
    'other'
  ]),
  amount: z.string().min(1, 'Amount is required').transform(val => parseFloat(val)),
  description: z.string().optional(),
  adjustmentDate: z.string(),
  probability: z.string().optional().transform(val => val ? parseFloat(val) : undefined)
});

// Form schema for revenue recognition
const recognitionFormSchema = z.object({
  contractId: z.number(),
  amount: z.string().min(1, 'Amount is required').transform(val => parseFloat(val)),
  recognitionDate: z.string(),
  performanceObligationId: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  description: z.string().optional(),
  recognitionMethod: z.enum(['point_in_time', 'over_time', 'output_method', 'input_method', 'manual']).optional(),
  recognitionReason: z.string().optional(),
  revenueType: z.enum([
    'service', 
    'product', 
    'license', 
    'subscription', 
    'maintenance', 
    'usage_based', 
    'other'
  ]).optional()
});

// Types for API responses
type RevenueCalculationResult = {
  totalRevenue: number;
  recognizedRevenue: number;
  deferredRevenue: number;
  remainingRevenue: number;
  revenueByPeriod: {
    period: string;
    amount: number;
    status: 'recognized' | 'projected';
  }[];
  performanceObligations: {
    id: number;
    name: string;
    allocated: number;
    recognized: number;
    remaining: number;
    percentComplete: number;
  }[];
};

type PerformanceObligation = {
  id: number;
  contractId: number;
  name: string;
  description: string | null;
  standaloneSellingPrice: number | null;
  allocationPercentage: number | null;
  startDate: string | null;
  endDate: string | null;
  status: 'active' | 'completed' | 'cancelled';
  recognitionMethod: 'point_in_time' | 'over_time' | 'output_method' | 'input_method';
  createdAt: string;
};

type TransactionPriceAdjustment = {
  id: number;
  contractId: number;
  adjustmentType: 'variable_consideration' | 'significant_financing' | 'non_cash' | 'payable_to_customer' | 'other';
  amount: number;
  description: string | null;
  adjustmentDate: string;
  probability: number | null;
  createdAt: string;
};

type RevenueRecord = {
  id: number;
  contractId: number;
  amount: number;
  recognitionDate: string;
  description: string | null;
  status: 'pending' | 'recognized' | 'adjusted' | 'reversed';
  performanceObligationId: number | null;
  recognitionMethod: 'point_in_time' | 'over_time' | 'output_method' | 'input_method' | 'manual' | null;
  recognitionReason: string | null;
  revenueType: string | null;
  createdAt: string;
};

interface RevenueCalculatorProps {
  contractId: number;
  contractName: string;
  totalValue: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function RevenueCalculator({ contractId, contractName, totalValue }: RevenueCalculatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Query for revenue calculation
  const { 
    data: calculationResult, 
    isLoading: isCalculationLoading,
    refetch: refetchCalculation
  } = useQuery<RevenueCalculationResult>({
    queryKey: ['/api/revenue/calculate', contractId],
    queryFn: () => 
      fetch(`/api/revenue/calculate/${contractId}?includeProjections=true`)
        .then(res => res.json()),
    enabled: !!contractId
  });

  // Query for performance obligations
  const { 
    data: obligations,
    isLoading: isObligationsLoading,
    refetch: refetchObligations
  } = useQuery<PerformanceObligation[]>({
    queryKey: ['/api/revenue/obligations', contractId],
    queryFn: () => 
      fetch(`/api/revenue/obligations/${contractId}`)
        .then(res => res.json()),
    enabled: !!contractId
  });

  // Query for transaction price adjustments
  const { 
    data: adjustments,
    isLoading: isAdjustmentsLoading,
    refetch: refetchAdjustments
  } = useQuery<TransactionPriceAdjustment[]>({
    queryKey: ['/api/revenue/adjustments', contractId],
    queryFn: () => 
      fetch(`/api/revenue/adjustments/${contractId}`)
        .then(res => res.json()),
    enabled: !!contractId
  });

  // Query for revenue records
  const { 
    data: records,
    isLoading: isRecordsLoading,
    refetch: refetchRecords
  } = useQuery<RevenueRecord[]>({
    queryKey: ['/api/revenue/records', contractId],
    queryFn: () => 
      fetch(`/api/revenue/records/${contractId}`)
        .then(res => res.json()),
    enabled: !!contractId
  });

  // Allocate transaction price mutation
  const allocateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/revenue/allocate/${contractId}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Transaction price allocated',
        description: 'The transaction price has been allocated to performance obligations',
      });
      // Refetch data
      refetchCalculation();
      refetchObligations();
    },
    onError: (error: any) => {
      toast({
        title: 'Allocation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Add performance obligation form
  const poForm = useForm<z.infer<typeof poFormSchema>>({
    resolver: zodResolver(poFormSchema),
    defaultValues: {
      contractId,
      name: '',
      description: '',
      status: 'active',
      recognitionMethod: 'over_time',
    },
  });

  // Add performance obligation mutation
  const addObligationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof poFormSchema>) => {
      const res = await apiRequest('POST', '/api/revenue/obligations', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Performance obligation added',
        description: 'The performance obligation has been added successfully',
      });
      poForm.reset({
        contractId,
        name: '',
        description: '',
        status: 'active',
        recognitionMethod: 'over_time',
      });
      // Refetch data
      refetchObligations();
      refetchCalculation();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add performance obligation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Add adjustment form
  const adjustmentForm = useForm<z.infer<typeof adjustmentFormSchema>>({
    resolver: zodResolver(adjustmentFormSchema),
    defaultValues: {
      contractId,
      adjustmentType: 'variable_consideration',
      adjustmentDate: new Date().toISOString().split('T')[0],
    },
  });

  // Add adjustment mutation
  const addAdjustmentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof adjustmentFormSchema>) => {
      const res = await apiRequest('POST', '/api/revenue/adjustments', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Adjustment added',
        description: 'The transaction price adjustment has been added successfully',
      });
      adjustmentForm.reset({
        contractId,
        adjustmentType: 'variable_consideration',
        adjustmentDate: new Date().toISOString().split('T')[0],
      });
      // Refetch data
      refetchAdjustments();
      refetchCalculation();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add adjustment',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Recognize revenue form
  const recognitionForm = useForm<z.infer<typeof recognitionFormSchema>>({
    resolver: zodResolver(recognitionFormSchema),
    defaultValues: {
      contractId,
      recognitionDate: new Date().toISOString().split('T')[0],
    },
  });

  // Recognize revenue mutation
  const recognizeRevenueMutation = useMutation({
    mutationFn: async (data: z.infer<typeof recognitionFormSchema>) => {
      const res = await apiRequest('POST', '/api/revenue/recognize', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Revenue recognized',
        description: 'The revenue has been recognized successfully',
      });
      recognitionForm.reset({
        contractId,
        recognitionDate: new Date().toISOString().split('T')[0],
      });
      // Refetch data
      refetchRecords();
      refetchCalculation();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to recognize revenue',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Format data for charts
  const chartData = calculationResult?.revenueByPeriod.map(item => ({
    period: item.period,
    amount: item.amount,
    isProjected: item.status === 'projected'
  })) || [];

  const pieData = calculationResult?.performanceObligations.map(po => ({
    name: po.name,
    value: po.allocated
  })) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">IFRS 15/ASC 606 Revenue Recognition</CardTitle>
          <CardDescription>
            {contractName} (ID: {contractId}) - Total Value: {formatCurrency(totalValue)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="obligations">Performance Obligations</TabsTrigger>
              <TabsTrigger value="adjustments">Price Adjustments</TabsTrigger>
              <TabsTrigger value="records">Revenue Records</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              {isCalculationLoading ? (
                <div className="text-center py-4">Loading revenue data...</div>
              ) : calculationResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Transaction Price</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(calculationResult.totalRevenue)}</div>
                        <Button 
                          variant="outline" 
                          className="mt-2" 
                          onClick={() => allocateMutation.mutate()}
                          disabled={allocateMutation.isPending}
                        >
                          {allocateMutation.isPending ? 'Allocating...' : 'Allocate Price'}
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recognized Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(calculationResult.recognizedRevenue)}</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((calculationResult.recognizedRevenue / calculationResult.totalRevenue) * 100)}% of total
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Deferred Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(calculationResult.deferredRevenue)}</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((calculationResult.deferredRevenue / calculationResult.totalRevenue) * 100)}% of total
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Revenue by Period</CardTitle>
                      </CardHeader>
                      <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                            <Legend />
                            <Bar 
                              dataKey="amount" 
                              name="Revenue" 
                              fill="#3B82F6" 
                              fillOpacity={1}
                              strokeOpacity={0.8}
                              stroke="#3B82F6" 
                              strokeWidth={0}
                              radius={4}
                              barSize={20}
                              opacity={(data) => data.isProjected ? 0.5 : 1}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Revenue Allocation</CardTitle>
                      </CardHeader>
                      <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              label={(entry) => entry.name}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">No revenue data available</div>
              )}
            </TabsContent>
            
            {/* Performance Obligations Tab */}
            <TabsContent value="obligations">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current obligations */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Performance Obligations</h3>
                  {isObligationsLoading ? (
                    <div className="text-center py-4">Loading obligations...</div>
                  ) : obligations && obligations.length > 0 ? (
                    <div className="space-y-4">
                      {obligations.map((obligation) => (
                        <Card key={obligation.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{obligation.name}</h4>
                                <p className="text-sm text-muted-foreground">{obligation.description}</p>
                              </div>
                              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {obligation.status}
                              </div>
                            </div>
                            <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                              <div>
                                <span className="text-muted-foreground">Recognition:</span>{' '}
                                {obligation.recognitionMethod.replace('_', ' ')}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Allocation:</span>{' '}
                                {obligation.allocationPercentage 
                                  ? `${obligation.allocationPercentage}%` 
                                  : 'Not allocated'}
                              </div>
                              {obligation.startDate && (
                                <div>
                                  <span className="text-muted-foreground">Start:</span>{' '}
                                  {new Date(obligation.startDate).toLocaleDateString()}
                                </div>
                              )}
                              {obligation.endDate && (
                                <div>
                                  <span className="text-muted-foreground">End:</span>{' '}
                                  {new Date(obligation.endDate).toLocaleDateString()}
                                </div>
                              )}
                              {obligation.standaloneSellingPrice && (
                                <div className="col-span-2">
                                  <span className="text-muted-foreground">SSP:</span>{' '}
                                  {formatCurrency(obligation.standaloneSellingPrice)}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No performance obligations defined
                    </div>
                  )}
                </div>
                
                {/* Add new obligation form */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Add Performance Obligation</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <Form {...poForm}>
                        <form onSubmit={poForm.handleSubmit(data => addObligationMutation.mutate(data))} className="space-y-4">
                          <FormField
                            control={poForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Software License" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={poForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Brief description" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={poForm.control}
                              name="recognitionMethod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Recognition Method</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="point_in_time">Point in time</SelectItem>
                                      <SelectItem value="over_time">Over time</SelectItem>
                                      <SelectItem value="output_method">Output method</SelectItem>
                                      <SelectItem value="input_method">Input method</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={poForm.control}
                              name="status"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Status</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
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

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={poForm.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={poForm.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={poForm.control}
                              name="standaloneSellingPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Standalone Selling Price</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="e.g., 5000" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={poForm.control}
                              name="allocationPercentage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Allocation Percentage</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="e.g., 25" {...field} />
                                  </FormControl>
                                  <FormDescription>% of total price</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={addObligationMutation.isPending}
                          >
                            {addObligationMutation.isPending ? 'Adding...' : 'Add Performance Obligation'}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Price Adjustments Tab */}
            <TabsContent value="adjustments">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current adjustments */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Transaction Price Adjustments</h3>
                  {isAdjustmentsLoading ? (
                    <div className="text-center py-4">Loading adjustments...</div>
                  ) : adjustments && adjustments.length > 0 ? (
                    <div className="space-y-4">
                      {adjustments.map((adjustment) => (
                        <Card key={adjustment.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium capitalize">
                                  {adjustment.adjustmentType.replace('_', ' ')}
                                </h4>
                                <p className="text-sm text-muted-foreground">{adjustment.description}</p>
                              </div>
                              <div className="text-lg font-semibold">
                                {adjustment.amount > 0 ? '+' : ''}{formatCurrency(adjustment.amount)}
                              </div>
                            </div>
                            <div className="text-sm mt-2">
                              <span className="text-muted-foreground">Date:</span>{' '}
                              {new Date(adjustment.adjustmentDate).toLocaleDateString()}
                              {adjustment.probability !== null && (
                                <div>
                                  <span className="text-muted-foreground">Probability:</span>{' '}
                                  {adjustment.probability * 100}%
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No transaction price adjustments
                    </div>
                  )}
                </div>
                
                {/* Add new adjustment form */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Add Price Adjustment</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <Form {...adjustmentForm}>
                        <form onSubmit={adjustmentForm.handleSubmit(data => addAdjustmentMutation.mutate(data))} className="space-y-4">
                          <FormField
                            control={adjustmentForm.control}
                            name="adjustmentType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Adjustment Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="variable_consideration">Variable Consideration</SelectItem>
                                    <SelectItem value="significant_financing">Significant Financing</SelectItem>
                                    <SelectItem value="non_cash">Non-cash Consideration</SelectItem>
                                    <SelectItem value="payable_to_customer">Payable to Customer</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={adjustmentForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g., 1000" {...field} />
                                </FormControl>
                                <FormDescription>Use negative numbers for reductions</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={adjustmentForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Brief description" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={adjustmentForm.control}
                              name="adjustmentDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={adjustmentForm.control}
                              name="probability"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Probability</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="e.g., 0.8" 
                                      step="0.01" 
                                      min="0" 
                                      max="1" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>Between 0 and 1</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={addAdjustmentMutation.isPending}
                          >
                            {addAdjustmentMutation.isPending ? 'Adding...' : 'Add Price Adjustment'}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Revenue Records Tab */}
            <TabsContent value="records">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current records */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Revenue Recognition Records</h3>
                  {isRecordsLoading ? (
                    <div className="text-center py-4">Loading records...</div>
                  ) : records && records.length > 0 ? (
                    <div className="space-y-4">
                      {records.map((record) => (
                        <Card key={record.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="text-lg font-semibold">
                                  {formatCurrency(record.amount)}
                                </div>
                                <p className="text-sm">
                                  {new Date(record.recognitionDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full uppercase">
                                {record.status}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">
                              {record.description}
                            </div>
                            {record.recognitionMethod && (
                              <div className="text-xs mt-2">
                                <span className="text-muted-foreground">Method:</span>{' '}
                                {record.recognitionMethod.replace('_', ' ')}
                              </div>
                            )}
                            {record.revenueType && (
                              <div className="text-xs">
                                <span className="text-muted-foreground">Type:</span>{' '}
                                {record.revenueType}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No revenue records
                    </div>
                  )}
                </div>
                
                {/* Add new record form */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Recognize Revenue</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <Form {...recognitionForm}>
                        <form onSubmit={recognitionForm.handleSubmit(data => recognizeRevenueMutation.mutate(data))} className="space-y-4">
                          <FormField
                            control={recognitionForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g., 5000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={recognitionForm.control}
                            name="recognitionDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Recognition Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={recognitionForm.control}
                            name="performanceObligationId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Performance Obligation</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value ? String(field.value) : undefined}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select obligation" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {obligations?.map((obligation) => (
                                      <SelectItem key={obligation.id} value={String(obligation.id)}>
                                        {obligation.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={recognitionForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Brief description" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={recognitionForm.control}
                              name="recognitionMethod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Recognition Method</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange}
                                    defaultValue={field.value ? field.value : undefined}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="point_in_time">Point in time</SelectItem>
                                      <SelectItem value="over_time">Over time</SelectItem>
                                      <SelectItem value="output_method">Output method</SelectItem>
                                      <SelectItem value="input_method">Input method</SelectItem>
                                      <SelectItem value="manual">Manual</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={recognitionForm.control}
                              name="revenueType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Revenue Type</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange}
                                    defaultValue={field.value ? field.value : undefined}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="service">Service</SelectItem>
                                      <SelectItem value="product">Product</SelectItem>
                                      <SelectItem value="license">License</SelectItem>
                                      <SelectItem value="subscription">Subscription</SelectItem>
                                      <SelectItem value="maintenance">Maintenance</SelectItem>
                                      <SelectItem value="usage_based">Usage Based</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={recognizeRevenueMutation.isPending}
                          >
                            {recognizeRevenueMutation.isPending ? 'Processing...' : 'Recognize Revenue'}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}