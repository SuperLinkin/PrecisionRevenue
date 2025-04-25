import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface UploadedFile {
  file: File;
  status: 'pending' | 'validating' | 'valid' | 'invalid';
  error?: string;
  preview?: string;
  contractDetails?: {
    customerName: string;
    totalValue: number;
    contractDate: string;
    products: string[];
  };
  selected?: boolean;
}

interface ContractValidation {
  isValid: boolean;
  contractType?: string;
  parties?: string[];
  value?: number;
  startDate?: string;
  endDate?: string;
  errors?: string[];
  customerName?: string;
  totalValue?: number;
  contractDate?: string;
  products?: string[];
}

export default function ContractUploadPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<Record<string, ContractValidation>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (!data.authenticated) {
          setLocation('/login');
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to verify authentication status",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setLocation, toast]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate number of files
    if (files.length > 20) {
      toast({
        title: "Too many files",
        description: "Maximum 20 files can be uploaded at once",
        variant: "destructive"
      });
      return;
    }

    // Validate total size (100MB limit)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 100 * 1024 * 1024) {
      toast({
        title: "Files too large",
        description: "Total file size exceeds 100MB limit",
        variant: "destructive"
      });
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(file => !file.type.includes('pdf'));
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed",
        variant: "destructive"
      });
      return;
    }

    // Add files to state
    const newFiles: UploadedFile[] = files.map(file => ({
      file,
      status: 'pending',
      selected: true
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const validateFiles = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    const results: Record<string, ContractValidation> = {};
    let progress = 0;

    for (const file of uploadedFiles) {
      try {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === file.file 
              ? { ...f, status: 'validating' }
              : f
          )
        );

        const formData = new FormData();
        formData.append('file', file.file);

        const response = await fetch('/api/contract-analysis/validate', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        results[file.file.name] = data;

        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === file.file 
              ? { 
                  ...f, 
                  status: data.isValid ? 'valid' : 'invalid',
                  error: data.errors?.join(', '),
                  contractDetails: data.isValid ? {
                    customerName: data.customerName || 'Unknown',
                    totalValue: data.value || 0,
                    contractDate: data.startDate || new Date().toISOString(),
                    products: data.products || []
                  } : undefined
                }
              : f
          )
        );
      } catch (error) {
        console.error('Validation error:', error);
        results[file.file.name] = {
          isValid: false,
          errors: ['Failed to validate contract']
        };
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === file.file 
              ? { ...f, status: 'invalid', error: 'Failed to validate contract' }
              : f
          )
        );
      }

      progress += 100 / uploadedFiles.length;
      setUploadProgress(Math.min(progress, 100));
    }

    setValidationResults(results);
    setIsUploading(false);
  };

  const handleApprove = async () => {
    try {
      setIsUploading(true);
      
      // Filter valid and selected files
      const validFiles = uploadedFiles.filter(file => file.status === 'valid' && file.selected);
      
      if (validFiles.length === 0) {
        toast({
          title: "No files selected",
          description: "Please select at least one valid contract to approve",
          variant: "destructive"
        });
        return;
      }

      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('files', file.file);
      });

      const response = await fetch('/api/contracts/bulk-upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Upload successful",
          description: `${validFiles.length} contracts have been added to the database`,
          variant: "default"
        });
        
        setUploadedFiles([]);
        setValidationResults({});
        setLocation('/contracts');
      } else {
        throw new Error(data.message || 'Failed to upload contracts');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Failed to upload contracts',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReject = () => {
    setUploadedFiles([]);
    setValidationResults({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleFileSelection = (fileName: string) => {
    setUploadedFiles(prev =>
      prev.map(file =>
        file.file.name === fileName
          ? { ...file, selected: !file.selected }
          : file
      )
    );
  };

  const toggleAllFiles = (selected: boolean) => {
    setUploadedFiles(prev =>
      prev.map(file => ({ ...file, selected }))
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Contract Upload" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Contracts</CardTitle>
                <CardDescription>
                  Upload up to 20 PDF contracts (max 100MB total) for processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedFiles.length === 0 ? (
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="contract-upload" 
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-neutral-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileText className="w-10 h-10 mb-3 text-secondary" />
                        <p className="mb-2 text-sm text-neutral">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF files only (MAX. 20 files, 100MB total)
                        </p>
                      </div>
                      <input 
                        id="contract-upload" 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept=".pdf,application/pdf"
                        multiple
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} selected
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all"
                          checked={uploadedFiles.every(f => f.selected)}
                          onCheckedChange={(checked) => toggleAllFiles(checked as boolean)}
                        />
                        <label htmlFor="select-all" className="text-sm">Select All</label>
                        <Button 
                          variant="outline" 
                          onClick={handleReject}
                          disabled={isUploading}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Validating contracts...</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                      </div>
                    )}

                    <div className="space-y-4">
                      {uploadedFiles.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-start space-x-4 p-4 rounded-lg border"
                        >
                          <Checkbox
                            checked={file.selected}
                            onCheckedChange={() => toggleFileSelection(file.file.name)}
                            disabled={file.status === 'invalid'}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">{file.file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              
                              {file.status === 'pending' && (
                                <Badge variant="outline">Pending</Badge>
                              )}
                              {file.status === 'validating' && (
                                <Badge variant="outline">
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  Validating
                                </Badge>
                              )}
                              {file.status === 'valid' && (
                                <Badge variant="default" className="bg-green-500">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Valid
                                </Badge>
                              )}
                              {file.status === 'invalid' && (
                                <Badge variant="destructive">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Invalid
                                </Badge>
                              )}
                            </div>

                            {file.contractDetails && (
                              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Customer</p>
                                  <p className="font-medium">{file.contractDetails.customerName}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Total Value</p>
                                  <p className="font-medium">${file.contractDetails.totalValue.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Contract Date</p>
                                  <p className="font-medium">{new Date(file.contractDetails.contractDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Products/Services</p>
                                  <p className="font-medium">{file.contractDetails.products.join(', ')}</p>
                                </div>
                              </div>
                            )}

                            {file.error && (
                              <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{file.error}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {!isUploading && uploadedFiles.length > 0 && (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={handleReject}
                        >
                          Reject All
                        </Button>
                        <Button 
                          onClick={validateFiles}
                          disabled={isUploading}
                        >
                          Validate Files
                        </Button>
                      </div>
                    )}

                    {!isUploading && uploadedFiles.some(f => f.status === 'valid') && (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={handleReject}
                        >
                          Reject
                        </Button>
                        <Button 
                          onClick={handleApprove}
                          disabled={isUploading || !uploadedFiles.some(f => f.status === 'valid' && f.selected)}
                        >
                          Approve Selected
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 