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

interface UploadedFile {
  file: File;
  status: 'pending' | 'validating' | 'valid' | 'invalid';
  error?: string;
  preview?: string;
}

interface ContractValidation {
  isValid: boolean;
  contractType?: string;
  parties?: string[];
  value?: number;
  startDate?: string;
  endDate?: string;
  errors?: string[];
}

export default function BulkUploadPage() {
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
        // Don't redirect on error, just show a toast
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
    if (totalSize > 100 * 1024 * 1024) { // 100MB in bytes
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
      status: 'pending'
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
        // Update status to validating
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === file.file 
              ? { ...f, status: 'validating' }
              : f
          )
        );

        // Create form data
        const formData = new FormData();
        formData.append('file', file.file);

        // Send to validation endpoint
        const response = await fetch('/api/contract-analysis/validate', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        results[file.file.name] = data;

        // Update file status based on validation
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === file.file 
              ? { 
                  ...f, 
                  status: data.isValid ? 'valid' : 'invalid',
                  error: data.errors?.join(', ')
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

      // Update progress
      progress += 100 / uploadedFiles.length;
      setUploadProgress(Math.min(progress, 100));
    }

    setValidationResults(results);
    setIsUploading(false);
  };

  const handleApprove = async () => {
    try {
      setIsUploading(true);
      
      // Filter valid files
      const validFiles = uploadedFiles.filter(file => file.status === 'valid');
      
      // Create form data with all valid files
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('files', file.file);
      });

      // Send to bulk upload endpoint
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
        
        // Reset state and navigate to contracts page
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
        <DashboardHeader title="Bulk Contract Upload" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Contracts</CardTitle>
                <CardDescription>
                  Upload up to 20 PDF contracts (max 100MB total) for bulk processing
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
                      <Button 
                        variant="outline" 
                        onClick={handleReject}
                        disabled={isUploading}
                      >
                        Clear All
                      </Button>
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
                          className="flex items-center justify-between p-4 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
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

                    {!isUploading && Object.keys(validationResults).length > 0 && (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={handleReject}
                        >
                          Reject
                        </Button>
                        <Button 
                          onClick={handleApprove}
                          disabled={isUploading || uploadedFiles.some(f => f.status === 'invalid')}
                        >
                          Approve & Upload
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