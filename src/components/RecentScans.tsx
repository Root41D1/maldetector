
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useScanHistory } from '@/contexts/ScanHistoryContext';
import { formatDistanceToNow } from 'date-fns';
import { formatFileSize, getFileIcon } from '@/utils/fileUtils';
import ThreatStatusBadge from '@/components/ThreatStatusBadge';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const RecentScans: React.FC = () => {
  const { getRecentScans } = useScanHistory();
  const navigate = useNavigate();
  const recentScans = getRecentScans(5);

  const getIcon = (iconName: string): LucideIcon => {
    return (LucideIcons as any)[iconName] || LucideIcons.File;
  };

  if (recentScans.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>Your recently scanned files will appear here</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-center py-6">
          No scan history yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Recent Scans</CardTitle>
        <CardDescription>Your recently scanned files</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentScans.map((scan) => {
            const Icon = getIcon(getFileIcon(scan.fileType));
            
            return (
              <div
                key={scan.id}
                className="glass-panel p-3 flex justify-between items-center cursor-pointer border dark:border-gray-800"
                onClick={() => navigate(`/scan-result/${scan.id}`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium truncate max-w-[200px]">{scan.fileName}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatFileSize(scan.fileSize)} • {formatDistanceToNow(scan.scanDate, { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <ThreatStatusBadge status={scan.threatLevel} size="sm" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentScans;
