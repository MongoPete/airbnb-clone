import React from 'react';
import { Search, Heart, User, MessageCircle, Shield } from 'lucide-react';
import { Button } from './ui/button';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'search', label: 'Explore', icon: Search },
    { id: 'favorites', label: 'Wishlists', icon: Heart },
    { id: 'trips', label: 'Trips', icon: MessageCircle },
    { id: 'admin', label: 'MongoDB', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex items-center justify-around p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 h-auto py-2 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}