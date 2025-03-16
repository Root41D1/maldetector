
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Shield, CreditCard, Infinity, Lock } from 'lucide-react';
import { toast } from 'sonner';

const SubscriptionPage = () => {
  const { user, subscribe, remainingScans, isPremium } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = () => {
    // In a real app, this would redirect to a payment processor
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      subscribe();
      setIsProcessing(false);
      navigate('/scan');
    }, 2000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-5xl py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Upgrade Your Malware Protection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get unlimited file scans and premium features with our subscription plan
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card className={`border-2 ${!isPremium ? 'border-primary' : 'border-transparent'}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Free Plan</span>
                <Shield className="h-6 w-6 text-muted-foreground" />
              </CardTitle>
              <CardDescription>Basic protection for casual users</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-muted-foreground ml-1">/forever</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You've used {user?.scanCount || 0} out of {MAX_FREE_SCANS} scans
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Limited to 10 file scans</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Basic malware detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Scan history for 7 days</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
          <Card className={`border-2 ${isPremium ? 'border-primary' : 'border-transparent'}`}>
            <CardHeader>
              <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full w-fit mb-2">
                RECOMMENDED
              </div>
              <CardTitle className="flex items-center justify-between">
                <span>Premium</span>
                <Shield className="h-6 w-6 text-primary" />
              </CardTitle>
              <CardDescription>Advanced protection for power users</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$20</span>
                <span className="text-muted-foreground ml-1">/year</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {isPremium 
                  ? 'Your subscription is active' 
                  : 'Upgrade now for unlimited scans'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="flex items-center">
                    <span>Unlimited file scans</span>
                    <Infinity className="h-3 w-3 ml-1 text-primary" />
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Advanced threat detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Permanent scan history</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {isPremium ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button 
                  onClick={handleSubscribe} 
                  className="w-full" 
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 glass-panel p-6">
          <div className="flex items-start gap-4">
            <Lock className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Secure Payment Processing</h3>
              <p className="text-sm text-muted-foreground">
                Your payment information is securely processed and we never store your credit card 
                details. Subscriptions can be canceled at any time from your account settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Free scan limit constant
const MAX_FREE_SCANS = 10;

export default SubscriptionPage;
