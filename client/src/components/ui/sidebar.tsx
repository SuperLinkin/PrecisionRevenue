import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { 
  HomeIcon, 
  FileTextIcon, 
  DollarSignIcon, 
  BarChart2Icon, 
  SettingsIcon, 
  LogOutIcon
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <HomeIcon className="mr-3 h-6 w-6" />
    },
    { 
      path: '/contracts', 
      label: 'Contracts', 
      icon: <FileTextIcon className="mr-3 h-6 w-6" />
    },
    { 
      path: '/revenue', 
      label: 'Revenue', 
      icon: <DollarSignIcon className="mr-3 h-6 w-6" />
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: <BarChart2Icon className="mr-3 h-6 w-6" />
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: <SettingsIcon className="mr-3 h-6 w-6" />
    },
  ];
  
  return (
    <div className="w-64 bg-primary text-white h-screen flex flex-col">
      <div className="p-4 border-b border-primary-700">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <span className="text-xl font-bold cursor-pointer">PRA</span>
          </Link>
        </div>
      </div>
      <nav className="mt-5 px-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <span className={`group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
              location === item.path 
                ? 'bg-primary-700 text-white' 
                : 'text-white hover:bg-primary-700'
            }`}>
              {item.icon}
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-primary-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{user?.fullName ? getInitials(user.fullName) : getInitials(user?.username || '')}</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
            <p className="text-xs text-gray-300">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto bg-primary-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white"
            onClick={() => logout()}
          >
            <span className="sr-only">Log out</span>
            <LogOutIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
