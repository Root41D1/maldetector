import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Shield, AlertTriangle, ShieldCheck, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecentScans from '@/components/RecentScans';
import ScanStats from '@/components/ScanStats';
import { useScanHistory } from '@/contexts/ScanHistoryContext';
import { Separator } from '@/components/ui/separator';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { history, getMaliciousScans } = useScanHistory();
  const { isAuthenticated } = useAuth();
  const maliciousScans = getMaliciousScans();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="mb-8 text-center md:text-left space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Monitor and analyze your file scans in one place</p>
          </div>
          
          {/* Subscription Banner */}
          {isAuthenticated && <SubscriptionBanner />}

          {/* Welcome Card (for new users) */}
          {history.length === 0 && (
            <Card className="glass-panel mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="p-4 rounded-full bg-primary/10 shrink-0">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-3 text-center md:text-left">
                    <h2 className="text-2xl font-bold">Welcome to MalDetector</h2>
                    <p className="text-muted-foreground">Upload your first file to get started with malware scanning</p>
                    <Button size="lg" asChild className="mt-2">
                      <Link to="/scan">
                        <Upload className="mr-2 h-5 w-5" />
                        Scan a File
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Total Scans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{history.length}</div>
                <p className="text-muted-foreground text-sm">Files analyzed</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  Clean Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {history.filter(scan => scan.threatLevel === 'clean').length}
                </div>
                <p className="text-muted-foreground text-sm">No threats detected</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Threats Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{maliciousScans.length}</div>
                <p className="text-muted-foreground text-sm">
                  Malicious or suspicious files
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Chart Card */}
              <ScanStats />
              
              {/* Recent Activity Card */}
              {maliciousScans.length > 0 && (
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Detected Threats
                    </CardTitle>
                    <CardDescription>Files requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {maliciousScans.slice(0, 3).map((scan) => (
                      <Link key={scan.id} to={`/scan-result/${scan.id}`}>
                        <div className="glass-panel p-4 hover:bg-secondary/50 transition-colors border dark:border-gray-800">
                          <div className="flex justify-between items-center">
                            <div className="font-medium truncate">{scan.fileName}</div>
                            <div className="text-sm text-red-500 font-medium">
                              {scan.threatLevel === 'malicious' ? 'Malicious' : 'Suspicious'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    {maliciousScans.length > 3 && (
                      <div className="text-center pt-2">
                        <Button variant="outline" asChild>
                          <Link to="/history">
                            <History className="mr-2 h-4 w-4" />
                            View All Threats
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Action Card */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link to="/scan">
                      <Upload className="mr-2 h-4 w-4" />
                      Scan New File
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/history">
                      <History className="mr-2 h-4 w-4" />
                      View Scan History
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Recent Scans */}
              <RecentScans />
            </div>
          </div>
          
          {/* Footer Section with Info */}
          <div className="mt-12">
            <Separator className="mb-6" />
            <div className="text-center text-sm text-muted-foreground">
              <p>Powered by VirusTotal API • v1.0.0</p>
              <p className="mt-1">
                Scan files for malware, viruses, and other threats using multiple antivirus engines
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
