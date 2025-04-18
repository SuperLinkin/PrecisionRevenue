import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { 
  Home as HomeIcon, 
  FileText as FileTextIcon, 
  DollarSign as DollarSignIcon, 
  BarChart2 as BarChart2Icon, 
  Settings as SettingsIcon, 
  LogOut as LogOutIcon,
  Scale as ScaleIcon,
  TrendingUp as TrendingUpIcon,
  Clipboard as ClipboardIcon,
  Briefcase as BriefcaseIcon,
  Building as BuildingIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';


interface MenuItem {
  path: string;
  label: string;
  icon: JSX.Element;
}

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const menuItems: MenuItem[] = [
    { 
      path: '/dashboard', 
      label: 'CFO Dashboard', 
      icon: <HomeIcon className="h-5 w-5" />
    },
    { 
      path: '/contracts', 
      label: 'Contracts', 
      icon: <FileTextIcon className="h-5 w-5" />
    },
    { 
      path: '/revenue', 
      label: 'Revenue', 
      icon: <DollarSignIcon className="h-5 w-5" />
    },
    { 
      path: '/claus', 
      label: 'CLAUS', 
      icon: <ScaleIcon className="h-5 w-5" />
    },
    { 
      path: '/moca', 
      label: 'MOCA', 
      icon: <TrendingUpIcon className="h-5 w-5" />
    },
    { 
      path: '/disclosure', 
      label: 'Disclosure Generator', 
      icon: <ClipboardIcon className="h-5 w-5" />
    },
    { 
      path: '/analytics', 
      label: 'Revenue Analytics', 
      icon: <BarChart2Icon className="h-5 w-5" />
    },
    { 
      path: '/deal-desk', 
      label: 'Deal Desk', 
      icon: <BriefcaseIcon className="h-5 w-5" />
    },
    { 
      path: '/company', 
      label: 'Company Settings', 
      icon: <BuildingIcon className="h-5 w-5" />
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: <SettingsIcon className="h-5 w-5" />
    },
  ];

  // Group items into categories
  const mainItems = menuItems.slice(0, 3); // Dashboard, Contracts, Revenue
  const toolItems = menuItems.slice(3, 8); // CLAUS, MOCA, Disclosure, Analytics, Deal Desk
  const settingsItems = menuItems.slice(8); // Company Settings, Settings
  
  const renderNavItem = (item: { path: string; label: string; icon: JSX.Element }) => (
    <Link key={item.path} href={item.path}>
      <div
        className={`flex items-center px-4 py-2.5 mb-1 text-sm font-medium rounded-md cursor-pointer group transition-colors ${
          location === item.path 
            ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700 text-white shadow-md'
            : 'text-indigo-100 hover:bg-primary-700/50'
        }`}
      >
        <div className={`flex items-center justify-center h-8 w-8 rounded-lg mr-3 ${
          location === item.path ? 'bg-indigo-500/40' : 'bg-primary-800/40'
        }`}>
          {item.icon}
        </div>
        <span className="flex-1">{item.label}</span>
        {location === item.path && (
          <ChevronRightIcon className="h-4 w-4 text-indigo-300" />
        )}
      </div>
    </Link>
  );
  
  return (
    <div className="w-64 bg-gradient-to-b from-primary-900 to-primary-800 text-white h-screen flex flex-col shadow-xl">
      <div className="px-5 py-6 border-b border-primary-700/50">
        <Link href="/dashboard">
          <div className="flex items-center cursor-pointer hover:opacity-90 transition-opacity">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              PRA
            </div>
            <span className="ml-2 text-xs text-indigo-200 tracking-widest uppercase">
              Precision Revenue
            </span>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
              Main
            </h3>
            {mainItems.map(renderNavItem)}
          </div>
          
          {/* Tools */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
              Tools
            </h3>
            {toolItems.map(renderNavItem)}
          </div>
          
          {/* Settings */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
              Settings
            </h3>
            {settingsItems.map(renderNavItem)}
          </div>
        </nav>
      </div>
      
      <div className="p-4 border-t border-primary-700/50 bg-primary-800/60">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 shadow-md">
            <AvatarFallback className="bg-indigo-600 text-white">
              {user?.fullName ? getInitials(user.fullName) : getInitials(user?.username || '')}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
            <p className="text-xs text-indigo-200">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto bg-indigo-700/60 flex-shrink-0 p-1.5 rounded-full text-indigo-200 hover:text-white hover:bg-indigo-600 transition-colors"
            onClick={() => logout()}
          >
            <span className="sr-only">Log out</span>
            <LogOutIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
