import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { MetricsCard } from '@/components/ui/metrics-card';
import { RevenueChart } from '@/components/ui/revenue-chart';
import { ContractsTable } from '@/components/ui/contracts-table';
import { TaskList } from '@/components/ui/task-list';
import { ComplianceUpdates } from '@/components/ui/compliance-updates';
import { DollarSign, FileText, BarChart2, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-50 via-blue-50/60 to-indigo-50/50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="CFO Dashboard" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Welcome Message */}
            <div className="px-4 py-3 sm:px-0 mb-6">
              <h2 className="text-xl text-primary font-medium">
                Welcome back, <span className="font-medium">{user?.fullName || user?.username}</span>
              </h2>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your revenue metrics today
              </p>
            </div>
            
            {/* Dashboard overview */}
            <div className="px-4 sm:px-0">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <MetricsCard
                  title="Total Revenue"
                  value={formatCurrency(3427892)}
                  change={{
                    value: "8.2% from last quarter",
                    isPositive: true
                  }}
                  icon={<DollarSign className="h-6 w-6 text-blue-600" />}
                  iconColor="bg-blue-100"
                />
                
                <MetricsCard
                  title="Active Contracts"
                  value="248"
                  change={{
                    value: "12 new this month",
                    isPositive: true
                  }}
                  icon={<FileText className="h-6 w-6 text-emerald-600" />}
                  iconColor="bg-emerald-100"
                />
                
                <MetricsCard
                  title="Revenue Forecast"
                  value={formatCurrency(4182654)}
                  change={{
                    value: "18.4% annual growth",
                    isPositive: true
                  }}
                  icon={<TrendingUp className="h-6 w-6 text-indigo-600" />}
                  iconColor="bg-indigo-100"
                />
                
                <MetricsCard
                  title="Compliance Score"
                  value="97.5%"
                  change={{
                    value: "2.3% improvement",
                    isPositive: true
                  }}
                  icon={<BarChart2 className="h-6 w-6 text-violet-600" />}
                  iconColor="bg-violet-100"
                />
              </div>
              
              {/* Revenue Chart */}
              <div className="mt-6">
                <RevenueChart />
              </div>
              
              {/* Recent Contracts */}
              <div className="mt-6">
                <ContractsTable limit={4} />
              </div>
              
              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Revenue Recognition Tasks */}
                <TaskList />
                
                {/* Compliance Updates */}
                <ComplianceUpdates />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
