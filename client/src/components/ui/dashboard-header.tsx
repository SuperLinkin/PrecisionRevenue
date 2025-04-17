import { BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { user } = useAuth();
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="p-1 mr-4 rounded-full text-neutral hover:text-secondary">
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" />
          </Button>
          <div className="relative">
            <div>
              <Button variant="ghost" size="icon" className="flex text-sm rounded-full focus:outline-none">
                <span className="sr-only">Open user menu</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user?.fullName ? getInitials(user.fullName) : getInitials(user?.username || '')}</AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
