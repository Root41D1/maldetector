
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { virusTotalService, FileScanResult } from '@/services/virusTotalService';
import ScanResultSummary from '@/components/ScanResultSummary';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useScanHistory } from '@/contexts/ScanHistoryContext';

const ScanResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scanResult, setScanResult] = useState<FileScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { history } = useScanHistory();
  
  // Find the scan in history
  const scanItem = id ? history.find(item => item.id === id) : null;
  
  useEffect(() => {
    if (!id) return;
    
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const result = await virusTotalService.getFileReport(id);
        setScanResult(result);
      } catch (err) {
        console.error('Failed to fetch scan result:', err);
        setError('Failed to load scan results. Please try again later.');
        toast.error('Error loading scan results');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [id]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-5xl">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading scan results...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => navigate('/scan')}>Try Another Scan</Button>
          </div>
        ) : (
          <>
            {scanItem && scanResult && (
              <ScanResultSummary
                scanItem={scanItem}
                scanResult={scanResult}
              />
            )}
            
            {!scanItem && (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">Scan details not found</p>
                <Button onClick={() => navigate('/scan')}>Go To Scanner</Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ScanResultPage;
