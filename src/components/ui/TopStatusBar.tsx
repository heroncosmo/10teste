import React from 'react';
import { Bell, Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TopStatusBarProps {
  creditsRemaining: number;
  totalCredits?: number;
  notificationCount?: number;
  userName?: string;
}

const TopStatusBar: React.FC<TopStatusBarProps> = ({
  creditsRemaining,
  totalCredits = 10,
  notificationCount = 0,
  userName
}) => {
  return (
    <div className="bg-white text-gray-800 px-4 py-3 flex justify-between items-center sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
          <span className="text-green-500 text-sm">🚀</span>
        </div>
        <div>
          <span className="font-bold text-lg">Lead Pilot</span>
          <p className="text-xs text-gray-500">Networking Inteligente</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Credits */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
        <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
          <span className="text-amber-500">🪙</span>
          <span className="text-gray-700">{creditsRemaining}/{totalCredits}</span>
        </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Créditos disponíveis para desbloquear leads
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Notification with badge */}
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white">
              {notificationCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopStatusBar; 