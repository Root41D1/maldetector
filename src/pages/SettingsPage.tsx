
import React from 'react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';
import { Settings, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Settings className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Configure your MalDetector preferences
          </p>
        </div>
        
        <div className="animate-slide-in space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-check">Auto-check previous scans</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically check if a file has been scanned before
                  </p>
                </div>
                <Switch id="auto-check" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Scan notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when scans are completed
                  </p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure VirusTotal API settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="use-proxy">Use CORS Proxy</Label>
                  <p className="text-sm text-muted-foreground">
                    Use a CORS proxy for API requests (required for browser-based scanning)
                  </p>
                </div>
                <Switch id="use-proxy" defaultChecked />
              </div>
              
              <div className="flex items-center text-sm mt-6">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Settings are saved automatically to your browser's local storage
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
