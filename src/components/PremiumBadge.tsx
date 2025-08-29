import React from 'react';
import { Badge } from './ui/badge';
import { Crown } from 'lucide-react';

interface PremiumBadgeProps {
  className?: string;
}

export function PremiumBadge({ className }: PremiumBadgeProps) {
  return (
    <Badge variant="secondary" className={`bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-300 ${className}`}>
      <Crown className="w-3 h-3 mr-1" />
      Premium
    </Badge>
  );
}