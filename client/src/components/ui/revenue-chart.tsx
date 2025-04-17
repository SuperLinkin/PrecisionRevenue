import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Types
interface RevenueData {
  name: string;
  recognized: number;
  forecast: number;
}

// Sample data for the chart
const generateRevenueData = (timeframe: string): RevenueData[] => {
  if (timeframe === 'last30Days') {
    return [
      { name: 'Jan 1', recognized: 100000, forecast: 120000 },
      { name: 'Jan 8', recognized: 120000, forecast: 140000 },
      { name: 'Jan 15', recognized: 150000, forecast: 160000 },
      { name: 'Jan 22', recognized: 170000, forecast: 180000 },
      { name: 'Jan 29', recognized: 200000, forecast: 210000 },
    ];
  } else if (timeframe === 'lastQuarter') {
    return [
      { name: 'Oct', recognized: 800000, forecast: 900000 },
      { name: 'Nov', recognized: 1000000, forecast: 1100000 },
      { name: 'Dec', recognized: 1300000, forecast: 1400000 },
      { name: 'Jan', recognized: 1500000, forecast: 1600000 },
    ];
  } else {
    // lastYear
    return [
      { name: 'Q1', recognized: 2500000, forecast: 2700000 },
      { name: 'Q2', recognized: 2800000, forecast: 3000000 },
      { name: 'Q3', recognized: 3200000, forecast: 3400000 },
      { name: 'Q4', recognized: 3500000, forecast: 3800000 },
    ];
  }
};

const formatYAxis = (tickItem: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(tickItem);
};

const formatTooltip = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export function RevenueChart() {
  const [timeframe, setTimeframe] = useState('last30Days');
  const data = generateRevenueData(timeframe);
  
  return (
    <Card>
      <CardHeader className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-primary">Revenue Overview</CardTitle>
          <div className="flex items-center">
            <Select 
              value={timeframe} 
              onValueChange={(value) => setTimeframe(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last30Days">Last 30 Days</SelectItem>
                <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 py-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip 
                formatter={(value: number) => [formatTooltip(value)]}
                labelStyle={{ color: '#1E293B' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' 
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="recognized"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                name="Recognized Revenue"
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stackId="2"
                stroke="#22C55E"
                fill="#22C55E"
                name="Forecast Revenue"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
