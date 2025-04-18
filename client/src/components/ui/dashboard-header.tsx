import { BellIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { user } = useAuth();
  
  return (
    <header className="bg-gradient-to-r from-primary-50 via-blue-50/70 to-indigo-50/60 border-b border-indigo-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-700 to-primary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h1>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center relative bg-white rounded-full border border-blue-100 shadow-sm px-3 py-1.5">
            <SearchIcon className="h-4 w-4 text-neutral/60 mr-2" />
            <input 
              type="text" 
              placeholder="Search..."
              className="text-sm border-none bg-transparent outline-none w-48 placeholder:text-neutral/40"
            />
          </div>
          
          {/* Notifications */}
          <Button 
            variant="outline" 
            size="icon" 
            className="relative p-2 rounded-full bg-white border-blue-100 shadow-sm hover:bg-blue-50 hover:text-secondary"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </Button>
          
          {/* User Menu */}
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 rounded-full pl-1 pr-3 py-1 bg-white border-blue-100 shadow-sm hover:bg-blue-50"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.fullName ? getInitials(user.fullName) : getInitials(user?.username || '')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-primary hidden md:inline-block">{user?.fullName || user?.username}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
