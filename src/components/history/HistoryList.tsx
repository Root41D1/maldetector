
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanHistoryItem } from '@/contexts/ScanHistoryContext';
import { format } from 'date-fns';
import { formatFileSize, getFileIcon } from '@/utils/fileUtils';
import ThreatStatusBadge from '@/components/ThreatStatusBadge';
import { useNavigate } from 'react-router-dom';
import { History, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';

interface HistoryListProps {
  filteredHistory: ScanHistoryItem[];
  totalHistory: ScanHistoryItem[];
}

const HistoryList: React.FC<HistoryListProps> = ({ filteredHistory, totalHistory }) => {
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    return (LucideIcons as any)[iconName] || LucideIcons.File;
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Scan Results
          {filteredHistory.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({filteredHistory.length} {filteredHistory.length === 1 ? 'file' : 'files'})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              {totalHistory.length === 0 ? (
                <History className="h-12 w-12 text-muted-foreground opacity-30" />
              ) : (
                <Search className="h-12 w-12 text-muted-foreground opacity-30" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-1">
              {totalHistory.length === 0 ? 'No scan history yet' : 'No matching results'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {totalHistory.length === 0 
                ? 'Upload a file to start scanning for malware' 
                : 'Try adjusting your search or filter criteria'}
            </p>
            
            {totalHistory.length === 0 && (
              <Button onClick={() => navigate('/scan')}>
                Scan a File
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredHistory.map((scan) => {
              const Icon = getIcon(getFileIcon(scan.fileType));
              
              return (
                <div 
                  key={scan.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 px-4 -mx-4 cursor-pointer transition-colors"
                  onClick={() => navigate(`/scan-result/${scan.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/5 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="overflow-hidden">
                      <h3 className="font-medium truncate">{scan.fileName}</h3>
                      <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-2">
                        <span>{formatFileSize(scan.fileSize)}</span>
                        <span>•</span>
                        <span>{format(scan.scanDate, 'MMM d, yyyy h:mm a')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:flex-shrink-0 ml-10 sm:ml-0">
                    <ThreatStatusBadge status={scan.threatLevel} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryList;
