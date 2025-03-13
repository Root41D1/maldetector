
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

type ThreatLevel = 'clean' | 'suspicious' | 'malicious' | 'unknown';

interface ThreatStatusBadgeProps {
  status: ThreatLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ThreatStatusBadge: React.FC<ThreatStatusBadgeProps> = ({ 
  status, 
  showIcon = true,
  size = 'md'
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'clean':
        return {
          variant: 'outline' as const,
          className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800',
          icon: <CheckCircle className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} mr-1`} />,
          label: 'Clean'
        };
      case 'suspicious':
        return {
          variant: 'outline' as const,
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800',
          icon: <AlertTriangle className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} mr-1`} />,
          label: 'Suspicious'
        };
      case 'malicious':
        return {
          variant: 'outline' as const,
          className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
          icon: <XCircle className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} mr-1`} />,
          label: 'Malicious'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800',
          icon: <HelpCircle className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} mr-1`} />,
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig();
  
  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} ${size === 'sm' ? 'text-xs py-0 px-2' : size === 'lg' ? 'text-base py-1 px-3' : 'text-sm py-1 px-2'} font-medium`}
    >
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
};

export default ThreatStatusBadge;
