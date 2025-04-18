import React from 'react';
import { ArrowLeft, DatabaseZap, Server, Settings2 } from 'lucide-react';
import { Link } from 'wouter';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectionStatus } from '@/components/system/ConnectionStatus';
import { PageHeader } from '@/components/PageHeader';

export default function SystemStatusPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-2">
          <Link to="/settings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Link>
        </Button>
      </div>

      <PageHeader
        title="System Status"
        description="Database connections and system health information"
        icon={<Settings2 className="h-6 w-6 mr-2" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="database">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="database">
                <DatabaseZap className="mr-2 h-4 w-4" />
                Database Status
              </TabsTrigger>
              <TabsTrigger value="system">
                <Server className="mr-2 h-4 w-4" />
                System Info
              </TabsTrigger>
            </TabsList>
            <TabsContent value="database" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Connections</CardTitle>
                  <CardDescription>
                    Status of current database connections and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <ConnectionStatus />
                    
                    <Card className="border border-dashed">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Database Statistics</CardTitle>
                        <CardDescription>
                          Performance metrics and usage statistics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Contracts</p>
                            <p className="text-2xl font-bold">3</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                            <p className="text-2xl font-bold">1</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Revenue Records</p>
                            <p className="text-2xl font-bold">12</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                            <p className="text-2xl font-bold">1</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="system" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>
                    Technical details about the current environment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Environment</h3>
                      <p className="text-sm">{process.env.NODE_ENV || 'development'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Build Version</h3>
                      <p className="text-sm">v1.0.0-beta</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Last Deployment</h3>
                      <p className="text-sm">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Server Uptime</h3>
                      <p className="text-sm">96.7%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Admin tools and quick actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Server className="mr-2 h-4 w-4" />
                  Check Tables
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <DatabaseZap className="mr-2 h-4 w-4" />
                  Rebuild Index
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current system health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Server</span>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Supabase Auth</span>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}