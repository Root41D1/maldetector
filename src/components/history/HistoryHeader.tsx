
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface HistoryHeaderProps {
  historyLength: number;
  onClearClick: () => void;
}

const HistoryHeader: React.FC<HistoryHeaderProps> = ({ historyLength, onClearClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
        <p className="text-muted-foreground">View and manage your previous file scans</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onClearClick}
          disabled={historyLength === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>
    </div>
  );
};

export default HistoryHeader;
