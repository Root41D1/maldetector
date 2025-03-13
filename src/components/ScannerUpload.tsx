
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, FileSymlink, Shield, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Progress } from '@/components/ui/progress';
import { calculateSHA256, formatFileSize, getFileType } from '@/utils/fileUtils';
import { virusTotalService } from '@/services/virusTotalService';
import { useScanHistory } from '@/contexts/ScanHistoryContext';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 32 * 1024 * 1024; // 32MB (VirusTotal limit for free tier)

const ScannerUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { addScan } = useScanHistory();
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Start the progress animation
      setUploadProgress(10);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);
      
      // Calculate file hash
      const fileHash = await calculateSHA256(file);
      setUploadProgress(30);
      
      // First check if the file has been analyzed before
      const existingAnalysis = await virusTotalService.checkFileByHash(fileHash);
      setUploadProgress(60);
      
      if (existingAnalysis) {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Determine threat level
        const threatLevel = determineThreatLevel(existingAnalysis);
        
        // Add to scan history
        const scanItem = {
          id: existingAnalysis.id,
          fileName: file.name,
          fileSize: file.size,
          fileType: getFileType(file.name),
          scanDate: new Date(),
          scanResult: existingAnalysis,
          threatLevel,
        };
        
        addScan(scanItem);
        toast.success('File analysis retrieved from VirusTotal');
        
        // Navigate to result page
        setTimeout(() => {
          navigate(`/scan-result/${existingAnalysis.id}`);
        }, 500);
        
        return;
      }
      
      // If not, upload the file for scanning
      const analysisId = await virusTotalService.uploadFile(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Add to scan history with "unknown" threat level initially
      const scanItem = {
        id: analysisId,
        fileName: file.name,
        fileSize: file.size,
        fileType: getFileType(file.name),
        scanDate: new Date(),
        threatLevel: 'unknown',
      };
      
      addScan(scanItem);
      
      // Navigate to the analysis page
      toast.success('File uploaded successfully. Analyzing...');
      setTimeout(() => {
        navigate(`/scan-result/${analysisId}`);
      }, 500);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file for scanning');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [addScan, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
    multiple: false,
  });

  // Helper function to determine threat level
  const determineThreatLevel = (result: any): 'clean' | 'suspicious' | 'malicious' | 'unknown' => {
    if (!result || !result.attributes || !result.attributes.stats) {
      return 'unknown';
    }
    
    const stats = result.attributes.stats;
    
    if (stats.malicious > 0) {
      return 'malicious';
    } else if (stats.suspicious > 0) {
      return 'suspicious';
    } else if (stats.harmless > 0 && stats.malicious === 0 && stats.suspicious === 0) {
      return 'clean';
    } else {
      return 'unknown';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`glass-panel flex flex-col items-center justify-center p-10 transition-all duration-300 ${
          isDragActive ? 'border-primary border-2 shadow-lg scale-[1.02]' : ''
        } ${isUploading ? 'opacity-80' : 'hover:border-primary/50'}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4 mb-6">
          {isUploading ? (
            <div className="p-4 rounded-full bg-primary/10 animate-pulse">
              <Upload size={64} className="text-primary animate-bounce" />
            </div>
          ) : isDragActive ? (
            <div className="p-4 rounded-full bg-primary/10">
              <FileSymlink size={64} className="text-primary animate-pulse" />
            </div>
          ) : (
            <div className="p-4 rounded-full bg-primary/5">
              <Shield size={64} className="text-primary" />
            </div>
          )}
          
          <h2 className="text-2xl font-semibold tracking-tight">
            {isUploading ? 'Uploading file...' : isDragActive ? 'Drop to scan' : 'Upload a file to scan'}
          </h2>
        </div>
        
        {isUploading ? (
          <div className="w-full max-w-md space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">
              {uploadProgress < 100 ? 'Processing your file...' : 'Scan complete'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-center mb-6">
              Drag and drop a file here, or click to select a file for malware scanning
            </p>
            
            <Button className="px-8" disabled={isUploading}>
              <Upload className="mr-2 h-4 w-4" /> Select File
            </Button>
            
            <div className="mt-8 flex items-center text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>Maximum file size: 32MB (Free API limit)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScannerUpload;
