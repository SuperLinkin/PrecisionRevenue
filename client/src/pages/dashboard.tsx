import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { MetricsCard } from '@/components/ui/metrics-card';
import { RevenueChart } from '@/components/ui/revenue-chart';
import { ContractsTable } from '@/components/ui/contracts-table';
import { TaskList } from '@/components/ui/task-list';
import { ComplianceUpdates } from '@/components/ui/compliance-updates';
import { DollarSign, FileText, BarChart2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="CFO Dashboard" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Dashboard overview */}
            <div className="px-4 py-6 sm:px-0">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <MetricsCard
                  title="Total Revenue"
                  value={formatCurrency(3427892)}
                  change={{
                    value: "8.2% from last quarter",
                    isPositive: true
                  }}
                  icon={<DollarSign className="h-6 w-6 text-secondary" />}
                  iconColor="bg-secondary/10"
                />
                
                <MetricsCard
                  title="Active Contracts"
                  value="248"
                  change={{
                    value: "12 new this month",
                    isPositive: true
                  }}
                  icon={<FileText className="h-6 w-6 text-accent" />}
                  iconColor="bg-accent/10"
                />
                
                <MetricsCard
                  title="Revenue Forecast"
                  value={formatCurrency(4182654)}
                  change={{
                    value: "18.4% annual growth",
                    isPositive: true
                  }}
                  icon={<BarChart2 className="h-6 w-6 text-secondary" />}
                  iconColor="bg-secondary/10"
                />
              </div>
              
              {/* Revenue Chart */}
              <div className="mt-5">
                <RevenueChart />
              </div>
              
              {/* Recent Contracts */}
              <div className="mt-5">
                <ContractsTable limit={4} />
              </div>
              
              {/* Quick Actions */}
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
