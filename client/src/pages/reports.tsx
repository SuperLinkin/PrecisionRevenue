import { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Contract, RevenueRecord } from '@shared/schema';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DownloadIcon, PrinterIcon } from 'lucide-react';

export default function Reports() {
  const [timeframe, setTimeframe] = useState('quarter');
  const [reportType, setReportType] = useState('revenue');
  
  const { data: contracts } = useQuery<Contract[]>({
    queryKey: ['/api/contracts'],
  });
  
  // Format data for charts
  const getRevenueByClient = () => {
    if (!contracts) return [];
    
    // Group contracts by client and calculate total value
    const clientMap = new Map();
    contracts.forEach(contract => {
      const currentValue = clientMap.get(contract.clientName) || 0;
      clientMap.set(contract.clientName, currentValue + contract.value);
    });
    
    // Convert to array for charting
    return Array.from(clientMap.entries()).map(([name, value]) => ({
      name,
      value,
    })).sort((a, b) => b.value - a.value);
  };
  
  const getContractsByStatus = () => {
    if (!contracts) return [];
    
    // Count contracts by status
    const statusCounts = contracts.reduce((acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array for charting
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  };
  
  const getRevenueByMonth = () => {
    if (!contracts) return [];
    
    // Mock monthly revenue data
    // In a real app, this would come from the API
    return [
      { name: 'Jan', recognized: 250000, forecast: 260000 },
      { name: 'Feb', recognized: 285000, forecast: 290000 },
      { name: 'Mar', recognized: 310000, forecast: 315000 },
      { name: 'Apr', recognized: 325000, forecast: 340000 },
      { name: 'May', recognized: 350000, forecast: 370000 },
      { name: 'Jun', recognized: 370000, forecast: 390000 },
    ];
  };
  
  // Colors for charts
  const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  const pieData = reportType === 'revenue' ? getRevenueByClient() : getContractsByStatus();
  const barData = getRevenueByMonth();
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Financial Reports" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {/* Report Controls */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <CardTitle className="text-xl font-bold">Financial Analytics</CardTitle>
                      <CardDescription>Analyze your company's financial performance</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-0">
                      <Select 
                        value={reportType} 
                        onValueChange={setReportType}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue Analysis</SelectItem>
                          <SelectItem value="contracts">Contract Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={timeframe} 
                        onValueChange={setTimeframe}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Current Month</SelectItem>
                          <SelectItem value="quarter">Current Quarter</SelectItem>
                          <SelectItem value="year">Current Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <PrinterIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              {/* Report Content */}
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="distribution">Distribution</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {reportType === 'revenue' ? 'Total Revenue by Client' : 'Contracts by Status'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) => reportType === 'revenue' ? formatCurrency(value as number) : value}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Monthly Revenue</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={barData}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis tickFormatter={(value) => (
                                new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                  notation: 'compact',
                                  maximumFractionDigits: 1
                                }).format(value)
                              )} />
                              <Tooltip formatter={(value) => formatCurrency(value as number)} />
                              <Legend />
                              <Bar dataKey="recognized" fill="#3B82F6" name="Recognized" />
                              <Bar dataKey="forecast" fill="#22C55E" name="Forecast" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-neutral">Total Contracts</h3>
                          <p className="text-2xl font-bold text-primary">{contracts?.length || 0}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-neutral">Active Revenue</h3>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(contracts?.reduce((sum, contract) => 
                              contract.status === 'active' ? sum + contract.value : sum, 0) || 0
                            )}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-neutral">Avg. Contract Value</h3>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(
                              contracts?.length ? 
                              contracts.reduce((sum, contract) => sum + contract.value, 0) / contracts.length : 
                              0
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="distribution" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Client Revenue Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={getRevenueByClient()}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 120,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={(value) => (
                              new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                notation: 'compact',
                                maximumFractionDigits: 1
                              }).format(value)
                            )} />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Bar dataKey="value" fill="#3B82F6" name="Revenue" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="trends" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenue Recognition Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={getRevenueByMonth()}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => (
                              new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                notation: 'compact',
                                maximumFractionDigits: 1
                              }).format(value)
                            )} />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="recognized" 
                              stroke="#3B82F6" 
                              activeDot={{ r: 8 }}
                              name="Recognized Revenue"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="forecast" 
                              stroke="#22C55E" 
                              strokeDasharray="5 5"
                              name="Forecast Revenue"
                            />
                          </LineChart>
                        </ResponsiveContainer>
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
