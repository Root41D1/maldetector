
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SubscriptionBanner = () => {
  const { remainingScans, isPremium } = useAuth();
  const navigate = useNavigate();

  if (isPremium) {
    return (
      <Alert className="mb-6 bg-primary/10 border-primary/20">
        <Infinity className="h-4 w-4 text-primary" />
        <AlertDescription className="flex items-center justify-between">
          <span>You have unlimited scans with your premium subscription.</span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-6" variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>You have {remainingScans} free scans remaining. Upgrade to premium for unlimited scans.</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/subscription')}
          className="ml-4 bg-background"
        >
          Upgrade for $20
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default SubscriptionBanner;
