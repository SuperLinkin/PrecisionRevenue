import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { 
  ArrowUpRight, 
  Calendar, 
  ChevronsUpDown, 
  Download, 
  Filter, 
  Printer, 
  RefreshCw, 
  Share2 
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock MRR data
const mrrData = [
  { month: 'Jan', mrr: 420000, newMrr: 32000, expansionMrr: 18000, churned: 8000, contracted: 3000 },
  { month: 'Feb', mrr: 459000, newMrr: 35000, expansionMrr: 12000, churned: 5000, contracted: 3000 },
  { month: 'Mar', mrr: 498000, newMrr: 30000, expansionMrr: 15000, churned: 4000, contracted: 2000 },
  { month: 'Apr', mrr: 537000, newMrr: 28000, expansionMrr: 16000, churned: 3000, contracted: 2000 },
  { month: 'May', mrr: 576000, newMrr: 25000, expansionMrr: 19000, churned: 4000, contracted: 1000 },
  { month: 'Jun', mrr: 615000, newMrr: 22000, expansionMrr: 21000, churned: 3000, contracted: 1000 },
  { month: 'Jul', mrr: 654000, newMrr: 24000, expansionMrr: 20000, churned: 4000, contracted: 1000 },
  { month: 'Aug', mrr: 693000, newMrr: 26000, expansionMrr: 17000, churned: 3000, contracted: 1000 },
  { month: 'Sep', mrr: 732000, newMrr: 30000, expansionMrr: 14000, churned: 4000, contracted: 1000 },
  { month: 'Oct', mrr: 771000, newMrr: 32000, expansionMrr: 12000, churned: 4000, contracted: 1000 },
  { month: 'Nov', mrr: 810000, newMrr: 35000, expansionMrr: 10000, churned: 5000, contracted: 1000 },
  { month: 'Dec', mrr: 849000, newMrr: 38000, expansionMrr: 8000, churned: 6000, contracted: 1000 }
];

// Mock revenue by category
const revenueByCategory = [
  { name: 'SaaS Subscriptions', value: 3750000, fill: '#3b82f6' },
  { name: 'Professional Services', value: 950000, fill: '#22c55e' },
  { name: 'Support Contracts', value: 680000, fill: '#eab308' },
  { name: 'Training & Education', value: 420000, fill: '#8b5cf6' },
  { name: 'Licensing', value: 320000, fill: '#ec4899' }
];

// Mock customer cohort data
const cohortData = [
  { cohort: 'Q1 2022', month1: 100, month2: 95, month3: 92, month4: 88, month5: 85, month6: 82 },
  { cohort: 'Q2 2022', month1: 100, month2: 97, month3: 94, month4: 90, month5: 88, month6: 86 },
  { cohort: 'Q3 2022', month1: 100, month2: 96, month3: 93, month4: 91, month5: 89, month6: 87 },
  { cohort: 'Q4 2022', month1: 100, month2: 98, month3: 96, month4: 94, month5: 92, month6: 90 },
  { cohort: 'Q1 2023', month1: 100, month2: 97, month3: 95, month4: 93, month5: 91, month6: 89 },
  { cohort: 'Q2 2023', month1: 100, month2: 98, month3: 96, month4: 94, month5: null, month6: null },
  { cohort: 'Q3 2023', month1: 100, month2: 99, month3: 98, month4: null, month5: null, month6: null },
  { cohort: 'Q4 2023', month1: 100, month2: 99, month3: null, month4: null, month5: null, month6: null }
];

// Mock waterfall data
const waterfallData = {
  startingMrr: 420000,
  newMrr: 350000,
  expansionMrr: 182000,
  contractedMrr: 18000,
  churnedMrr: 85000,
  endingMrr: 849000
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 12 months');
  const [activeTab, setActiveTab] = useState('mrr');
  
  // Calculate Annual Recurring Revenue
  const arr = mrrData[mrrData.length - 1].mrr * 12;
  
  // Calculate Net Revenue Retention
  const nrr = (mrrData[mrrData.length - 1].mrr - mrrData[mrrData.length - 1].newMrr) / mrrData[0].mrr * 100;
  
  // Calculate average MRR growth rate
  const mrrGrowthRate = ((mrrData[mrrData.length - 1].mrr / mrrData[0].mrr) - 1) * 100;
  
  // Format the waterfall chart data
  const waterfallChartData = [
    { name: 'Starting MRR', value: waterfallData.startingMrr },
    { name: 'New MRR', value: waterfallData.newMrr },
    { name: 'Expansion MRR', value: waterfallData.expansionMrr },
    { name: 'Contracted MRR', value: -waterfallData.contractedMrr },
    { name: 'Churned MRR', value: -waterfallData.churnedMrr },
    { name: 'Ending MRR', value: waterfallData.endingMrr }
  ];
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Revenue Analytics" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-4 sm:px-0">
              
              {/* Header with filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl text-primary mb-4 md:mb-0">
                  Revenue Performance Metrics
                </h2>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative">
                    <Select defaultValue={dateRange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Last 12 months">Last 12 months</SelectItem>
                        <SelectItem value="YTD">Year to date</SelectItem>
                        <SelectItem value="Last quarter">Last quarter</SelectItem>
                        <SelectItem value="Custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-neutral">Monthly Recurring Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-semibold text-primary">
                        {formatCurrency(mrrData[mrrData.length - 1].mrr)}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        +{(((mrrData[mrrData.length - 1].mrr - mrrData[mrrData.length - 2].mrr) / mrrData[mrrData.length - 2].mrr) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      vs. {formatCurrency(mrrData[mrrData.length - 2].mrr)} last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-neutral">Annual Recurring Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-semibold text-primary">
                        {formatCurrency(arr)}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        +{mrrGrowthRate.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Annual growth rate
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-neutral">Net Revenue Retention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-semibold text-primary">
                        {nrr.toFixed(1)}%
                      </div>
                      <Badge className={nrr >= 100 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {nrr >= 100 ? "Healthy" : "At Risk"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: 110%
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-neutral">Customer Churn Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-semibold text-primary">
                        {((waterfallData.churnedMrr / (waterfallData.startingMrr)) * 100).toFixed(1)}%
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Improved
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      vs. 7.2% previous period
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Tabs */}
              <Tabs 
                defaultValue="mrr" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="mrr">MRR Trends</TabsTrigger>
                  <TabsTrigger value="waterfall">Revenue Waterfall</TabsTrigger>
                  <TabsTrigger value="segments">Revenue by Segment</TabsTrigger>
                  <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
                  <TabsTrigger value="metrics">SaaS Metrics</TabsTrigger>
                </TabsList>
                
                {/* MRR Trends Tab */}
                <TabsContent value="mrr" className="space-y-6">
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Monthly Recurring Revenue Trends</CardTitle>
                      <CardDescription>
                        Track the growth of your recurring revenue streams over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={mrrData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => [formatCurrency(Number(value))]} />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="mrr" 
                              name="MRR" 
                              stroke="#3b82f6" 
                              strokeWidth={3}
                              dot={{ r: 0 }}
                              activeDot={{ r: 6 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="newMrr" 
                              name="New MRR" 
                              stroke="#22c55e" 
                              dot={{ r: 0 }}
                              activeDot={{ r: 4 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="expansionMrr" 
                              name="Expansion MRR" 
                              stroke="#eab308" 
                              dot={{ r: 0 }}
                              activeDot={{ r: 4 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="churned" 
                              name="Churned MRR" 
                              stroke="#ef4444" 
                              dot={{ r: 0 }}
                              activeDot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                        <Button size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base text-primary">MRR Growth Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={mrrData.map((month, index, arr) => ({
                                month: month.month,
                                growthRate: index > 0 
                                  ? ((month.mrr / arr[index - 1].mrr) - 1) * 100 
                                  : 0
                              }))}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`]} />
                              <Line 
                                type="monotone" 
                                dataKey="growthRate" 
                                name="MRR Growth Rate" 
                                stroke="#3b82f6" 
                                dot={{ r: 0 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base text-primary">MRR Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={mrrData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              stackOffset="expand"
                              layout="vertical"
                            >
                              <XAxis type="number" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                              <YAxis dataKey="month" type="category" />
                              <Tooltip formatter={(value, name) => [
                                `${((Number(value) / mrrData.find(item => item.month === name)?.mrr || 1) * 100).toFixed(1)}%`, 
                                name === "newMrr" ? "New" : name === "expansionMrr" ? "Expansion" : name === "churned" ? "Churned" : "Contracted"
                              ]} />
                              <Legend />
                              <Bar dataKey="newMrr" stackId="a" fill="#22c55e" />
                              <Bar dataKey="expansionMrr" stackId="a" fill="#eab308" />
                              <Bar dataKey="churned" stackId="a" fill="#ef4444" />
                              <Bar dataKey="contracted" stackId="a" fill="#f97316" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Revenue Waterfall Tab */}
                <TabsContent value="waterfall" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Revenue Waterfall</CardTitle>
                      <CardDescription>
                        Visualize the components of your MRR change over the period
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={waterfallChartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [formatCurrency(Math.abs(Number(value)))]} />
                            <Bar dataKey="value" fill="#3b82f6">
                              {waterfallChartData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={
                                    index === 0 ? '#94a3b8' :
                                    index === waterfallChartData.length - 1 ? '#3b82f6' :
                                    entry.value > 0 ? '#22c55e' : '#ef4444'
                                  } 
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                        <div className="rounded-md border p-3">
                          <p className="text-xs text-muted-foreground">Starting MRR</p>
                          <p className="mt-1 text-lg font-semibold text-primary">{formatCurrency(waterfallData.startingMrr)}</p>
                        </div>
                        <div className="rounded-md border p-3">
                          <p className="text-xs text-muted-foreground">New MRR</p>
                          <p className="mt-1 text-lg font-semibold text-green-600">+{formatCurrency(waterfallData.newMrr)}</p>
                        </div>
                        <div className="rounded-md border p-3">
                          <p className="text-xs text-muted-foreground">Expansion MRR</p>
                          <p className="mt-1 text-lg font-semibold text-green-600">+{formatCurrency(waterfallData.expansionMrr)}</p>
                        </div>
                        <div className="rounded-md border p-3">
                          <p className="text-xs text-muted-foreground">Contraction & Churn</p>
                          <p className="mt-1 text-lg font-semibold text-red-600">-{formatCurrency(waterfallData.contractedMrr + waterfallData.churnedMrr)}</p>
                        </div>
                        <div className="rounded-md border p-3">
                          <p className="text-xs text-muted-foreground">Ending MRR</p>
                          <p className="mt-1 text-lg font-semibold text-primary">{formatCurrency(waterfallData.endingMrr)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Revenue by Segment Tab */}
                <TabsContent value="segments" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-xl text-primary">Revenue by Category</CardTitle>
                        <CardDescription>
                          Distribution of revenue across different business lines
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={revenueByCategory}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="name" type="category" />
                              <Tooltip formatter={(value) => [formatCurrency(Number(value))]} />
                              <Bar dataKey="value" name="Revenue">
                                {revenueByCategory.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl text-primary">Revenue Distribution</CardTitle>
                        <CardDescription>
                          Percentage breakdown by category
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={revenueByCategory}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {revenueByCategory.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [formatCurrency(Number(value))]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Total Revenue:</span>
                            <span>{formatCurrency(revenueByCategory.reduce((sum, item) => sum + item.value, 0))}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Cohort Analysis Tab */}
                <TabsContent value="cohort" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Cohort Retention Analysis</CardTitle>
                      <CardDescription>
                        Track customer retention rates across different customer cohorts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-secondary/10">
                              <th className="py-3 px-4 text-left text-primary">Cohort</th>
                              <th className="py-3 px-4 text-center text-primary">Month 1</th>
                              <th className="py-3 px-4 text-center text-primary">Month 2</th>
                              <th className="py-3 px-4 text-center text-primary">Month 3</th>
                              <th className="py-3 px-4 text-center text-primary">Month 4</th>
                              <th className="py-3 px-4 text-center text-primary">Month 5</th>
                              <th className="py-3 px-4 text-center text-primary">Month 6</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cohortData.map((cohort, index) => (
                              <tr key={index} className="border-b hover:bg-secondary/5">
                                <td className="py-3 px-4 text-neutral">{cohort.cohort}</td>
                                <td className="py-3 px-4 text-center text-neutral">{cohort.month1 ? `${cohort.month1}%` : '-'}</td>
                                <td className="py-3 px-4 text-center text-neutral">{cohort.month2 ? `${cohort.month2}%` : '-'}</td>
                                <td className="py-3 px-4 text-center text-neutral">{cohort.month3 ? `${cohort.month3}%` : '-'}</td>
                                <td className="py-3 px-4 text-center text-neutral">{cohort.month4 ? `${cohort.month4}%` : '-'}</td>
                                <td className="py-3 px-4 text-center text-neutral">{cohort.month5 ? `${cohort.month5}%` : '-'}</td>
                                <td className="py-3 px-4 text-center text-neutral">{cohort.month6 ? `${cohort.month6}%` : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-sm text-primary mb-2">Cohort Analysis Insights</h3>
                        <div className="text-sm text-neutral space-y-2">
                          <p>• Customer retention has improved in recent cohorts, with Q4 2022 and Q1 2023 showing the best 6-month retention rates.</p>
                          <p>• The most significant drop in retention typically occurs between months 3 and 4, suggesting a critical period for customer engagement.</p>
                          <p>• Q2 2023 cohort shows promising early retention, exceeding previous cohorts at similar stages.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* SaaS Metrics Tab */}
                <TabsContent value="metrics" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl text-primary">Key SaaS Metrics</CardTitle>
                        <CardDescription>
                          Critical performance indicators for your subscription business
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b">
                            <div>
                              <p className="text-sm text-primary">Customer Acquisition Cost (CAC)</p>
                              <p className="text-xs text-muted-foreground">Average cost to acquire a new customer</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg text-primary">{formatCurrency(4850)}</p>
                              <p className="text-xs text-red-500">+12% vs. previous period</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-3 border-b">
                            <div>
                              <p className="text-sm text-primary">Customer Lifetime Value (CLV)</p>
                              <p className="text-xs text-muted-foreground">Projected revenue from average customer</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg text-primary">{formatCurrency(27500)}</p>
                              <p className="text-xs text-green-500">+8% vs. previous period</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-3 border-b">
                            <div>
                              <p className="text-sm text-primary">CLV:CAC Ratio</p>
                              <p className="text-xs text-muted-foreground">Value created per acquisition dollar</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg text-primary">5.7x</p>
                              <p className="text-xs text-green-500">Above 3x target</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-3 border-b">
                            <div>
                              <p className="text-sm text-primary">Payback Period</p>
                              <p className="text-xs text-muted-foreground">Months to recover acquisition cost</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg text-primary">8.4 months</p>
                              <p className="text-xs text-amber-500">Within target range</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-3">
                            <div>
                              <p className="text-sm text-primary">Average Revenue Per User (ARPU)</p>
                              <p className="text-xs text-muted-foreground">Monthly revenue per customer</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg text-primary">{formatCurrency(1250)}</p>
                              <p className="text-xs text-green-500">+5% vs. previous period</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl text-primary">Subscription Health</CardTitle>
                        <CardDescription>
                          Metrics that indicate the health of your subscription business
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm text-primary">Gross Margin</p>
                              <p className="text-sm text-neutral">78%</p>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-secondary h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Target: 80%</p>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm text-primary">Revenue Churn</p>
                              <p className="text-sm text-neutral">5.8%</p>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Target: &lt;5%</p>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm text-primary">Customer Engagement</p>
                              <p className="text-sm text-neutral">82%</p>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Target: &gt;75%</p>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm text-primary">Feature Adoption</p>
                              <p className="text-sm text-neutral">64%</p>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Target: &gt;70%</p>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm text-primary">Account Expansion Rate</p>
                              <p className="text-sm text-neutral">28%</p>
                            </div>
                            <div className="w-full bg-secondary/20 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Target: &gt;25%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}