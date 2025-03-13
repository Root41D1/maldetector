
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useScanHistory } from '@/contexts/ScanHistoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { formatFileSize, getFileIcon } from '@/utils/fileUtils';
import ThreatStatusBadge from '@/components/ThreatStatusBadge';
import { useNavigate } from 'react-router-dom';
import { Trash2, History, Search, Filter, AlertTriangle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HistoryPage = () => {
  const { history, clearHistory } = useScanHistory();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showClearDialog, setShowClearDialog] = useState(false);

  const getIcon = (iconName: string) => {
    return (LucideIcons as any)[iconName] || LucideIcons.File;
  };

  const filteredHistory = history.filter(scan => {
    const matchesSearch = scan.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'malicious' && scan.threatLevel === 'malicious') ||
      (filter === 'suspicious' && scan.threatLevel === 'suspicious') ||
      (filter === 'clean' && scan.threatLevel === 'clean') ||
      (filter === 'unknown' && scan.threatLevel === 'unknown');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
            <p className="text-muted-foreground">View and manage your previous file scans</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowClearDialog(true)}
              disabled={history.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex-shrink-0 w-full md:w-52">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Files</SelectItem>
                    <SelectItem value="malicious">Malicious</SelectItem>
                    <SelectItem value="suspicious">Suspicious</SelectItem>
                    <SelectItem value="clean">Clean</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* History List */}
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
                  {history.length === 0 ? (
                    <History className="h-12 w-12 text-muted-foreground opacity-30" />
                  ) : (
                    <Search className="h-12 w-12 text-muted-foreground opacity-30" />
                  )}
                </div>
                <h3 className="text-lg font-medium mb-1">
                  {history.length === 0 ? 'No scan history yet' : 'No matching results'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {history.length === 0 
                    ? 'Upload a file to start scanning for malware' 
                    : 'Try adjusting your search or filter criteria'}
                </p>
                
                {history.length === 0 && (
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
        
        {/* Clear History Dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Clear Scan History
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. All scan history will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClearDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  clearHistory();
                  setShowClearDialog(false);
                }}
              >
                Clear History
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default HistoryPage;
