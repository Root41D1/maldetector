
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useScanHistory } from '@/contexts/ScanHistoryContext';
import HistoryHeader from '@/components/history/HistoryHeader';
import HistorySearchFilter from '@/components/history/HistorySearchFilter';
import HistoryList from '@/components/history/HistoryList';
import ClearHistoryDialog from '@/components/history/ClearHistoryDialog';

const HistoryPage = () => {
  const { history, clearHistory } = useScanHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showClearDialog, setShowClearDialog] = useState(false);

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
        <HistoryHeader 
          historyLength={history.length} 
          onClearClick={() => setShowClearDialog(true)} 
        />
        
        <HistorySearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
        />
        
        <HistoryList 
          filteredHistory={filteredHistory} 
          totalHistory={history} 
        />
        
        <ClearHistoryDialog
          open={showClearDialog}
          onOpenChange={setShowClearDialog}
          onConfirm={clearHistory}
        />
      </div>
    </Layout>
  );
};

export default HistoryPage;
