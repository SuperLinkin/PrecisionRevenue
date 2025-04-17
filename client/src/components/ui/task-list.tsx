import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@shared/schema';
import { getStatusColor, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function TaskList() {
  const queryClient = useQueryClient();
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest('PUT', `/api/tasks/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  const handleTaskStatusChange = (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateTaskMutation.mutate({ id: taskId, status: newStatus });
  };

  return (
    <Card>
      <CardHeader className="px-5 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-primary">Revenue Recognition Tasks</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <ul className="divide-y divide-gray-200">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <li key={index} className="py-3">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 rounded mr-3" />
                  <div className="ml-3 flex-grow">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32 mt-1" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full ml-auto" />
                </div>
              </li>
            ))
          ) : tasks?.length ? (
            tasks.map((task) => (
              <li key={task.id} className="py-3">
                <div className="flex items-center">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.status === 'completed'}
                    onCheckedChange={() => handleTaskStatusChange(task.id, task.status || 'pending')}
                  />
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-neutral line-through' : 'text-primary'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-neutral">
                      {task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No due date'}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.priority || 'medium')}`}>
                      {task.priority?.charAt(0).toUpperCase() + (task.priority?.slice(1) || '')}
                    </span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="py-3 text-center text-sm text-neutral">No tasks found</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
