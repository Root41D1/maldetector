
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useScanHistory } from '@/contexts/ScanHistoryContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ShieldCheck, AlertTriangle, ShieldAlert, HelpCircle } from 'lucide-react';

const ScanStats: React.FC = () => {
  const { history } = useScanHistory();
  
  // Count scans by threat level
  const cleanCount = history.filter(scan => scan.threatLevel === 'clean').length;
  const suspiciousCount = history.filter(scan => scan.threatLevel === 'suspicious').length;
  const maliciousCount = history.filter(scan => scan.threatLevel === 'malicious').length;
  const unknownCount = history.filter(scan => scan.threatLevel === 'unknown').length;
  
  const data = [
    { name: 'Clean', value: cleanCount, color: '#10b981' },
    { name: 'Suspicious', value: suspiciousCount, color: '#f59e0b' },
    { name: 'Malicious', value: maliciousCount, color: '#ef4444' },
    { name: 'Unknown', value: unknownCount, color: '#9ca3af' },
  ].filter(item => item.value > 0);
  
  // If no data, show a message
  if (history.length === 0 || data.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Scan Statistics</CardTitle>
          <CardDescription>Overview of your scan results</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">No scan data available yet</p>
        </CardContent>
      </Card>
    );
  }
  
  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-morphism rounded-lg p-3 shadow-md text-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-muted-foreground">{data.value} file{data.value !== 1 ? 's' : ''}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <CardTitle>Scan Statistics</CardTitle>
        <CardDescription>Overview of your scan results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-green-50 dark:bg-green-950 mb-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-xl font-semibold">{cleanCount}</div>
            <div className="text-sm text-muted-foreground">Clean Files</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-yellow-50 dark:bg-yellow-950 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-xl font-semibold">{suspiciousCount}</div>
            <div className="text-sm text-muted-foreground">Suspicious</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-red-50 dark:bg-red-950 mb-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-xl font-semibold">{maliciousCount}</div>
            <div className="text-sm text-muted-foreground">Malicious</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-900 mb-2">
              <HelpCircle className="h-5 w-5 text-gray-500" />
            </div>
            <div className="text-xl font-semibold">{unknownCount}</div>
            <div className="text-sm text-muted-foreground">Unknown</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanStats;
