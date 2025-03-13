
import React from 'react';
import { FileScanResult } from '@/services/virusTotalService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, AlertTriangle, ShieldAlert, Clock, Calendar, FileText, AlertCircle } from 'lucide-react';
import ThreatStatusBadge from '@/components/ThreatStatusBadge';
import { formatFileSize } from '@/utils/fileUtils';
import { format } from 'date-fns';

interface ScanResultSummaryProps {
  scanResult?: FileScanResult;
  fileName: string;
  fileSize: number;
  scanDate: Date;
  isLoading?: boolean;
}

const ScanResultSummary: React.FC<ScanResultSummaryProps> = ({
  scanResult,
  fileName,
  fileSize,
  scanDate,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="glass-card animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = scanResult?.attributes?.stats;
  const totalEngines = stats 
    ? stats.harmless + stats.malicious + stats.suspicious + stats.undetected + stats.timeout
    : 0;
  
  // Calculate threat level
  const getThreatLevel = (): 'clean' | 'suspicious' | 'malicious' | 'unknown' => {
    if (!stats) return 'unknown';
    
    if (stats.malicious > 0) {
      return 'malicious';
    } else if (stats.suspicious > 0) {
      return 'suspicious';
    } else if (stats.harmless > 0 && stats.malicious === 0 && stats.suspicious === 0) {
      return 'clean';
    }
    
    return 'unknown';
  };
  
  const threatLevel = getThreatLevel();
  
  // Summary text based on threat level
  const getSummaryText = () => {
    if (!stats) return 'This file is currently being analyzed';
    
    switch (threatLevel) {
      case 'clean':
        return 'No security vendors flagged this file as malicious';
      case 'suspicious':
        return `${stats.suspicious} out of ${totalEngines} security vendors flagged this file as suspicious`;
      case 'malicious':
        return `${stats.malicious} out of ${totalEngines} security vendors flagged this file as malicious`;
      default:
        return 'Analysis is inconclusive or incomplete';
    }
  };
  
  // Get appropriate icon based on threat level
  const getStatusIcon = () => {
    switch (threatLevel) {
      case 'clean':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'malicious':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2 truncate">
            <FileText className="h-5 w-5 text-primary" />
            <span className="truncate">{fileName}</span>
          </div>
          <ThreatStatusBadge status={threatLevel} size="md" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Scanned on {format(scanDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Scanned at {format(scanDate, 'h:mm a')}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            File size: {formatFileSize(fileSize)}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            {getStatusIcon()}
            <h3 className="font-medium">{getSummaryText()}</h3>
          </div>
          
          {stats && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Detection ratio</span>
                <span className="font-medium">
                  {stats.malicious + stats.suspicious} / {totalEngines}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-1.5">
                {stats.malicious > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 min-w-16 text-center dark:bg-red-950 dark:text-red-400 dark:border-red-800">
                      {stats.malicious}
                    </Badge>
                    <Progress value={(stats.malicious / totalEngines) * 100} className="h-2 bg-red-100 dark:bg-red-950" indicatorClassName="bg-red-500" />
                    <span className="text-xs text-muted-foreground">Malicious</span>
                  </div>
                )}
                
                {stats.suspicious > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 min-w-16 text-center dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800">
                      {stats.suspicious}
                    </Badge>
                    <Progress value={(stats.suspicious / totalEngines) * 100} className="h-2 bg-yellow-100 dark:bg-yellow-950" indicatorClassName="bg-yellow-500" />
                    <span className="text-xs text-muted-foreground">Suspicious</span>
                  </div>
                )}
                
                {stats.harmless > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 min-w-16 text-center dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                      {stats.harmless}
                    </Badge>
                    <Progress value={(stats.harmless / totalEngines) * 100} className="h-2 bg-green-100 dark:bg-green-950" indicatorClassName="bg-green-500" />
                    <span className="text-xs text-muted-foreground">Clean</span>
                  </div>
                )}
                
                {stats.undetected > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 min-w-16 text-center dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800">
                      {stats.undetected}
                    </Badge>
                    <Progress value={(stats.undetected / totalEngines) * 100} className="h-2 bg-gray-100 dark:bg-gray-900" indicatorClassName="bg-gray-500" />
                    <span className="text-xs text-muted-foreground">Undetected</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResultSummary;
