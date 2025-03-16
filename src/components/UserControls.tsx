
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, User, CreditCard, BadgeCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserControls: React.FC = () => {
  const { user, isAuthenticated, logout, isPremium } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="ghost" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Log in
          </Button>
        </Link>
        <Link to="/signup">
          <Button size="sm">
            <User className="h-4 w-4 mr-2" />
            Sign up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <User className="h-4 w-4 mr-2" />
          {user?.name || user?.email?.split('@')[0] || 'User'}
          {isPremium && (
            <span className="absolute -top-1.5 -right-1.5">
              <BadgeCheck className="h-4 w-4 text-primary" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/subscription" className="flex items-center w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>{isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}</span>
              {isPremium && (
                <BadgeCheck className="ml-auto h-4 w-4 text-primary" />
              )}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserControls;
