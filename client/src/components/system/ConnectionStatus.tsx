import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  AlertCircle, 
  CheckCircle, 
  DatabaseBackup, 
  RefreshCcw, 
  Server 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type ConnectionType = 'postgres' | 'supabase';

type DatabaseStatus = {
  success: boolean;
  message?: string;
  version?: string;
};

type HealthStatus = {
  status: string;
  postgres: DatabaseStatus;
  supabase: DatabaseStatus;
  timestamp: string;
  environment: string;
};

export function ConnectionStatus() {
  const { toast } = useToast();
  
  const { 
    data: healthStatus, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<HealthStatus>({
    queryKey: ['/api/health'],
    refetchInterval: 300000, // Check every 5 minutes
    refetchOnWindowFocus: false,
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: 'Refreshing connection status',
      description: 'Checking database connections...',
    });
  };

  const getStatusBadge = (type: ConnectionType) => {
    if (isLoading) {
      return (
        <Badge variant="outline" className="gap-1 h-7">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </Badge>
      );
    }

    if (error || !healthStatus) {
      return (
        <Badge variant="destructive" className="gap-1 h-7">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Error checking connection</span>
        </Badge>
      );
    }

    const dbStatus = healthStatus[type];
    
    if (dbStatus.success) {
      return (
        <Badge variant="outline" className="gap-1 bg-green-600 text-white hover:bg-green-700 h-7">
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Connected</span>
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive" className="gap-1 h-7">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Connection Error</span>
        </Badge>
      );
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          Database Connections
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </CardTitle>
        <CardDescription>
          Connection status to data sources
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">PostgreSQL</span>
            </div>
            {getStatusBadge('postgres')}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DatabaseBackup className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Supabase</span>
            </div>
            {getStatusBadge('supabase')}
          </div>

          {healthStatus && (
            <div className="mt-4 text-xs text-muted-foreground">
              Last checked: {new Date(healthStatus.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}