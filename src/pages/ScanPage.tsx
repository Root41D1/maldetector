
import React from 'react';
import Layout from '@/components/Layout';
import ScannerUpload from '@/components/ScannerUpload';
import { Separator } from '@/components/ui/separator';
import { Shield, Upload, AlertTriangle, Database } from 'lucide-react';

const ScanPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">File Malware Scanner</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Upload a file to scan for malware, viruses, and other threats using multiple antivirus engines
          </p>
        </div>
        
        <div className="animate-slide-in">
          <ScannerUpload />
        </div>
        
        <div className="mt-12 space-y-8">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Upload</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your file or click to select one for instant scanning
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Multi-Engine Detection</h3>
              <p className="text-sm text-muted-foreground">
                Files are analyzed by multiple antivirus engines for comprehensive results
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Detailed Reports</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed scan reports and actionable insights for any threats detected
              </p>
            </div>
          </div>
          
          <div className="glass-panel p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">File Privacy Notice</h3>
                <p className="text-sm text-muted-foreground">
                  Files you upload will be sent to VirusTotal for analysis. VirusTotal may store a copy of 
                  any file submitted. Do not upload sensitive or personal files. By using this service, you 
                  agree to VirusTotal's terms of service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScanPage;
