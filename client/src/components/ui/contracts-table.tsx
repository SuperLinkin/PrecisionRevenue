import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Contract } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

interface ContractsTableProps {
  limit?: number;
}

export function ContractsTable({ limit }: ContractsTableProps) {
  const { data: contracts, isLoading } = useQuery<Contract[]>({
    queryKey: ['/api/contracts'],
  });

  const displayContracts = limit ? contracts?.slice(0, limit) : contracts;
  
  return (
    <Card>
      <CardHeader className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-primary">Recent Contracts</CardTitle>
          <Button variant="link" className="text-sm text-secondary hover:text-blue-600">
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-5 py-3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-gray-50 text-neutral px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contract</TableHead>
                <TableHead className="bg-gray-50 text-neutral px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Client</TableHead>
                <TableHead className="bg-gray-50 text-neutral px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Start Date</TableHead>
                <TableHead className="bg-gray-50 text-neutral px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Value</TableHead>
                <TableHead className="bg-gray-50 text-neutral px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(limit || 4).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24 mt-1" />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : displayContracts?.length ? (
                displayContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary">{contract.name}</div>
                      <div className="text-xs text-neutral">#{contract.contractNumber}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">{contract.clientName}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">{formatDate(contract.startDate)}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">{formatCurrency(contract.value)}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-neutral">
                    No contracts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
