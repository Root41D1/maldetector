
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FileScanResult } from '@/services/virusTotalService';

export interface ScanHistoryItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  scanDate: Date;
  scanResult?: FileScanResult;
  threatLevel: 'clean' | 'suspicious' | 'malicious' | 'unknown';
}

interface ScanHistoryContextType {
  history: ScanHistoryItem[];
  addScan: (scan: ScanHistoryItem) => void;
  clearHistory: () => void;
  getRecentScans: (count: number) => ScanHistoryItem[];
  getMaliciousScans: () => ScanHistoryItem[];
}

const ScanHistoryContext = createContext<ScanHistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'maldetector_scan_history';

export const ScanHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          scanDate: new Date(item.scanDate)
        }));
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Failed to load scan history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save scan history:', error);
    }
  }, [history]);

  const addScan = (scan: ScanHistoryItem) => {
    setHistory(prev => [scan, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getRecentScans = (count: number) => {
    return history.slice(0, count);
  };

  const getMaliciousScans = () => {
    return history.filter(scan => scan.threatLevel === 'malicious' || scan.threatLevel === 'suspicious');
  };

  return (
    <ScanHistoryContext.Provider
      value={{
        history,
        addScan,
        clearHistory,
        getRecentScans,
        getMaliciousScans
      }}
    >
      {children}
    </ScanHistoryContext.Provider>
  );
};

export const useScanHistory = () => {
  const context = useContext(ScanHistoryContext);
  if (context === undefined) {
    throw new Error('useScanHistory must be used within a ScanHistoryProvider');
  }
  return context;
};
