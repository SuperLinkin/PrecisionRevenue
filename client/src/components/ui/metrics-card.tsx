import { ReactNode } from 'react';
import { ArrowUpIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: ReactNode;
  iconColor: string;
}

export function MetricsCard({ title, value, change, icon, iconColor }: MetricsCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-primary">{value}</div>
                {change && (
                  <div className="flex items-center text-sm text-accent">
                    {change.isPositive ? (
                      <ArrowUpIcon className="w-4 h-4 mr-1" />
                    ) : (
                      <svg className="w-4 h-4 mr-1 rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {change.value}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
