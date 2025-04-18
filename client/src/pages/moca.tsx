import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AnimatedButton } from '@/components/ui/animated-button';
import { ArrowUpRight, FilePlus, Upload } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Mock revenue forecast data
const baseForecastData = [
  { month: 'Jan', revenue: 420000, expenses: 310000, profit: 110000 },
  { month: 'Feb', revenue: 440000, expenses: 315000, profit: 125000 },
  { month: 'Mar', revenue: 480000, expenses: 320000, profit: 160000 },
  { month: 'Apr', revenue: 520000, expenses: 340000, profit: 180000 },
  { month: 'May', revenue: 540000, expenses: 345000, profit: 195000 },
  { month: 'Jun', revenue: 580000, expenses: 350000, profit: 230000 },
  { month: 'Jul', revenue: 620000, expenses: 370000, profit: 250000 },
  { month: 'Aug', revenue: 650000, expenses: 375000, profit: 275000 },
  { month: 'Sep', revenue: 690000, expenses: 380000, profit: 310000 },
  { month: 'Oct', revenue: 720000, expenses: 390000, profit: 330000 },
  { month: 'Nov', revenue: 760000, expenses: 400000, profit: 360000 },
  { month: 'Dec', revenue: 800000, expenses: 420000, profit: 380000 },
];

// Mock scenario variables
const scenarioVariables = [
  { id: 'churn', name: 'Customer Churn Rate', default: 5, min: 0, max: 20, unit: '%' },
  { id: 'acquisition', name: 'New Customer Acquisition', default: 12, min: 0, max: 50, unit: '%' },
  { id: 'pricing', name: 'Price Increase', default: 0, min: 0, max: 20, unit: '%' },
  { id: 'expansion', name: 'Account Expansion', default: 8, min: 0, max: 30, unit: '%' },
  { id: 'cogs', name: 'COGS Reduction', default: 0, min: 0, max: 15, unit: '%' },
];

export default function MocaPage() {
  // State for scenario variables
  const [variables, setVariables] = useState(
    scenarioVariables.reduce((acc, variable) => {
      acc[variable.id] = variable.default;
      return acc;
    }, {} as Record<string, number>)
  );
  
  // State for scenario comparison
  const [compareScenario, setCompareScenario] = useState(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('scenario');
  
  // Helper function to calculate adjusted forecast based on variables
  const calculateAdjustedForecast = () => {
    return baseForecastData.map(month => {
      const churnFactor = 1 - (variables.churn / 100);
      const acquisitionFactor = 1 + (variables.acquisition / 100);
      const pricingFactor = 1 + (variables.pricing / 100);
      const expansionFactor = 1 + (variables.expansion / 100);
      const cogsFactor = 1 - (variables.cogs / 100);
      
      const adjustedRevenue = month.revenue * churnFactor * acquisitionFactor * pricingFactor * expansionFactor;
      const adjustedExpenses = month.expenses * cogsFactor;
      const adjustedProfit = adjustedRevenue - adjustedExpenses;
      
      return {
        ...month,
        adjustedRevenue,
        adjustedExpenses,
        adjustedProfit,
      };
    });
  };
  
  const adjustedForecast = calculateAdjustedForecast();
  
  // Calculate annual totals
  const baseAnnualRevenue = baseForecastData.reduce((sum, month) => sum + month.revenue, 0);
  const baseAnnualProfit = baseForecastData.reduce((sum, month) => sum + month.profit, 0);
  const adjustedAnnualRevenue = adjustedForecast.reduce((sum, month) => sum + month.adjustedRevenue, 0);
  const adjustedAnnualProfit = adjustedForecast.reduce((sum, month) => sum + month.adjustedProfit, 0);
  
  // Calculate percentage changes
  const revenueChange = ((adjustedAnnualRevenue - baseAnnualRevenue) / baseAnnualRevenue) * 100;
  const profitChange = ((adjustedAnnualProfit - baseAnnualProfit) / baseAnnualProfit) * 100;
  
  // Handle variable slider change
  const handleVariableChange = (id: string, value: number[]) => {
    setVariables({ ...variables, [id]: value[0] });
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="MOCA" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-4 sm:px-0">
              
              {/* Intro Section */}
              <div className="mb-8">
                <h2 className="text-2xl text-primary">Modeling & Optimization for Comprehensive Analysis</h2>
                <p className="text-neutral mt-2">
                  MOCA provides advanced financial modeling and predictive analysis to optimize your revenue forecasting and business planning.
                </p>
              </div>
              
              {/* Main Tabs */}
              <Tabs 
                defaultValue="scenario" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="scenario">Scenario Builder</TabsTrigger>
                  <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
                  <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
                </TabsList>
                
                {/* Scenario Builder Tab */}
                <TabsContent value="scenario" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl text-primary">Variables</CardTitle>
                          <CardDescription>
                            Adjust variables to model different business scenarios
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {scenarioVariables.map((variable) => (
                            <div key={variable.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label htmlFor={variable.id} className="text-sm text-primary">
                                  {variable.name}
                                </Label>
                                <span className="text-sm text-secondary font-medium">
                                  {variables[variable.id]}{variable.unit}
                                </span>
                              </div>
                              <Slider
                                id={variable.id}
                                min={variable.min}
                                max={variable.max}
                                step={0.1}
                                value={[variables[variable.id]]}
                                onValueChange={(value) => handleVariableChange(variable.id, value)}
                              />
                            </div>
                          ))}
                          
                          <div className="pt-4 flex justify-between items-center border-t">
                            <Label htmlFor="compare-scenario" className="cursor-pointer">
                              Compare to base scenario
                            </Label>
                            <Switch
                              id="compare-scenario"
                              checked={compareScenario}
                              onCheckedChange={setCompareScenario}
                            />
                          </div>
                          
                          <div className="flex justify-between">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setVariables(
                                  scenarioVariables.reduce((acc, variable) => {
                                    acc[variable.id] = variable.default;
                                    return acc;
                                  }, {} as Record<string, number>)
                                );
                              }}
                            >
                              Reset
                            </Button>
                            <Button onClick={() => {}}>
                              Save Scenario
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl text-primary">Impact Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral">Annual Revenue</span>
                            <div className="text-right">
                              <div className="text-base text-primary">${(adjustedAnnualRevenue / 1000000).toFixed(2)}M</div>
                              <div className={`text-xs ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {revenueChange > 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral">Annual Profit</span>
                            <div className="text-right">
                              <div className="text-base text-primary">${(adjustedAnnualProfit / 1000000).toFixed(2)}M</div>
                              <div className={`text-xs ${profitChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {profitChange > 0 ? '+' : ''}{profitChange.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral">Profit Margin</span>
                            <div className="text-right">
                              <div className="text-base text-primary">
                                {((adjustedAnnualProfit / adjustedAnnualRevenue) * 100).toFixed(1)}%
                              </div>
                              <div className={`text-xs ${profitChange - revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {profitChange - revenueChange > 0 ? '+' : ''}{(profitChange - revenueChange).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-xl text-primary">Revenue Projection</CardTitle>
                          <CardDescription>
                            Visualize the impact of your scenario variables on projected revenue
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={adjustedForecast}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`]} />
                                <Legend />
                                {compareScenario && (
                                  <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Base Revenue"
                                    stroke="#9ca3af"
                                    dot={false}
                                    strokeDasharray="5 5"
                                  />
                                )}
                                <Line
                                  type="monotone"
                                  dataKey="adjustedRevenue"
                                  name="Projected Revenue"
                                  stroke="#3b82f6"
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 5 }}
                                />
                                {compareScenario && (
                                  <Line
                                    type="monotone"
                                    dataKey="profit"
                                    name="Base Profit"
                                    stroke="#9ca3af"
                                    dot={false}
                                    strokeDasharray="5 5"
                                  />
                                )}
                                <Line
                                  type="monotone"
                                  dataKey="adjustedProfit"
                                  name="Projected Profit"
                                  stroke="#22c55e"
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 5 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline">
                              Export CSV
                            </Button>
                            <Button>
                              Generate Report
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Revenue Forecast Tab */}
                <TabsContent value="forecast" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Revenue Forecasting</CardTitle>
                      <CardDescription>
                        Detailed revenue projections based on historical data and market trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <Button variant="outline" className="flex items-center">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Financial Data
                        </Button>
                        <Button variant="outline" className="flex items-center">
                          <FilePlus className="mr-2 h-4 w-4" />
                          Create Custom Model
                        </Button>
                      </div>
                      
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="forecast-model" className="text-sm">Forecast Model</Label>
                          <select 
                            id="forecast-model" 
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="predictive">Predictive Analysis</option>
                            <option value="trend">Trend-based</option>
                            <option value="seasonal">Seasonal Adjustment</option>
                            <option value="multi">Multi-variable</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="time-period" className="text-sm">Time Period</Label>
                          <select 
                            id="time-period" 
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="quarterly">Quarterly</option>
                            <option value="monthly">Monthly</option>
                            <option value="annual">Annual</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confidence" className="text-sm">Confidence Level</Label>
                          <select 
                            id="confidence" 
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="90">90%</option>
                            <option value="95">95%</option>
                            <option value="99">99%</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-6 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={baseForecastData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`]} />
                            <Legend />
                            <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
                            <Bar dataKey="profit" name="Profit" fill="#22c55e" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline">Export Data</Button>
                        <Button>Generate Forecast</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Predictive Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl text-primary">AI-Powered Insights</CardTitle>
                        <CardDescription>
                          Discover opportunities and optimization suggestions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-background p-4 rounded-md border">
                            <div className="flex justify-between items-start mb-2">
                              <Badge className="bg-blue-500">Revenue Optimization</Badge>
                              <span className="text-xs text-muted-foreground">High Impact</span>
                            </div>
                            <p className="text-neutral text-sm mb-2">
                              Increasing pricing by 4.5% for enterprise tier customers would increase annual revenue by $412,000 with minimal churn risk.
                            </p>
                            <Button size="sm" variant="outline" className="mt-2">
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                              Apply to Model
                            </Button>
                          </div>
                          
                          <div className="bg-background p-4 rounded-md border">
                            <div className="flex justify-between items-start mb-2">
                              <Badge className="bg-green-500">Expansion Opportunities</Badge>
                              <span className="text-xs text-muted-foreground">Medium Impact</span>
                            </div>
                            <p className="text-neutral text-sm mb-2">
                              Cross-selling to current customer base could increase monthly recurring revenue by 8.2% based on current adoption patterns.
                            </p>
                            <Button size="sm" variant="outline" className="mt-2">
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                              Apply to Model
                            </Button>
                          </div>
                          
                          <div className="bg-background p-4 rounded-md border">
                            <div className="flex justify-between items-start mb-2">
                              <Badge className="bg-amber-500">Retention Strategy</Badge>
                              <span className="text-xs text-muted-foreground">Medium Impact</span>
                            </div>
                            <p className="text-neutral text-sm mb-2">
                              Implementing a customer success program could reduce churn by 2.3%, resulting in $285,000 annual revenue preservation.
                            </p>
                            <Button size="sm" variant="outline" className="mt-2">
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                              Apply to Model
                            </Button>
                          </div>
                          
                          <div className="bg-background p-4 rounded-md border">
                            <div className="flex justify-between items-start mb-2">
                              <Badge className="bg-purple-500">Cost Efficiency</Badge>
                              <span className="text-xs text-muted-foreground">Low Impact</span>
                            </div>
                            <p className="text-neutral text-sm mb-2">
                              Optimizing cloud infrastructure could reduce operational expenses by 3.5%, increasing overall profit margin.
                            </p>
                            <Button size="sm" variant="outline" className="mt-2">
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                              Apply to Model
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl text-primary">Financial Simulation</CardTitle>
                        <CardDescription>
                          Upload financial data to simulate future scenarios
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <AnimatedCard className="flex flex-col justify-center items-center p-8 border-2 border-dashed rounded-md hover:border-secondary">
                            <FilePlus className="w-12 h-12 text-secondary mb-4" />
                            <p className="text-center text-sm text-neutral mb-2">
                              Upload Balance Sheet
                            </p>
                            <Button variant="outline" size="sm">Select File</Button>
                          </AnimatedCard>
                          
                          <AnimatedCard delay={0.1} className="flex flex-col justify-center items-center p-8 border-2 border-dashed rounded-md hover:border-secondary">
                            <FilePlus className="w-12 h-12 text-secondary mb-4" />
                            <p className="text-center text-sm text-neutral mb-2">
                              Upload P&L Statement
                            </p>
                            <Button variant="outline" size="sm">Select File</Button>
                          </AnimatedCard>
                        </div>
                        
                        <div className="bg-secondary/10 p-4 rounded-md">
                          <h3 className="text-base text-primary mb-2">Advanced Simulation Features</h3>
                          <ul className="space-y-2 text-sm text-neutral">
                            <li className="flex items-center">
                              <span className="mr-2 text-secondary">•</span>
                              Multi-variable scenario testing
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2 text-secondary">•</span>
                              Cash flow projections
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2 text-secondary">•</span>
                              KPI impact analysis
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2 text-secondary">•</span>
                              Risk assessment
                            </li>
                          </ul>
                        </div>
                        
                        <AnimatedButton className="w-full">
                          Run Financial Simulation
                        </AnimatedButton>
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