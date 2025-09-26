import React from 'react';
import { ChevronRight, Settings, HelpCircle, Shield, Bell, CreditCard, User } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';

export function ProfileTab() {
  const menuItems = [
    {
      icon: User,
      title: 'Personal information',
      description: 'Provide personal details and how we can reach you',
    },
    {
      icon: Settings,
      title: 'Account settings',
      description: 'Update your settings and preferences',
    },
    {
      icon: CreditCard,
      title: 'Payments and payouts',
      description: 'Review payments, payouts, coupons, and gift cards',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Choose notification preferences and how you want to be contacted',
    },
    {
      icon: Shield,
      title: 'Privacy and sharing',
      description: 'Manage your personal data, connected services, and data sharing',
    },
    {
      icon: HelpCircle,
      title: 'Get help',
      description: 'Get support or give us feedback',
    },
  ];

  return (
    <div className="p-4 pb-20">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
        </Avatar>
        <div>
          <h2>John Doe</h2>
          <p className="text-muted-foreground">Show profile</p>
        </div>
      </div>

      {/* Airbnb your home */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-4 mb-6 text-white">
        <h3 className="mb-2">Airbnb your home</h3>
        <p className="text-sm mb-3 opacity-90">
          It's simple to get set up and start earning.
        </p>
        <Button variant="secondary" size="sm">
          Learn more
        </Button>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index}>
              <Button
                variant="ghost"
                className="w-full h-auto p-4 justify-start"
              >
                <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Button>
              {index < menuItems.length - 1 && <Separator />}
            </div>
          );
        })}
      </div>

      <Separator className="my-6" />

      {/* Legal */}
      <div className="space-y-2">
        <Button variant="ghost" className="w-full justify-start h-auto py-3">
          <span>Legal</span>
          <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
        </Button>
        <Button variant="ghost" className="w-full justify-start h-auto py-3">
          <span>Support & resources</span>
          <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
        </Button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">Version 24.49</p>
      </div>
    </div>
  );
}