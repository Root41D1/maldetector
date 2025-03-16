
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Upload, 
  History, 
  Settings, 
  Shield, 
  Menu, 
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import UserControls from './UserControls';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  const routes = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/',
    },
    {
      label: 'Scan File',
      icon: Upload,
      href: '/scan',
    },
    {
      label: 'Scan History',
      icon: History,
      href: '/history',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
    },
  ];

  const NavItems = () => (
    <div className="space-y-2">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={location.pathname === route.href ? 'default' : 'ghost'}
          className={cn(
            'w-full justify-start',
            location.pathname === route.href 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-secondary hover:text-secondary-foreground'
          )}
          onClick={() => setIsOpen(false)}
          asChild
        >
          <Link to={route.href}>
            <route.icon className="mr-2 h-5 w-5" />
            {route.label}
          </Link>
        </Button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <div className="hidden lg:flex flex-col w-64 p-6 border-r glass-morphism">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">MalDetector</span>
          </div>
          <Separator className="mb-6" />
          <NavItems />
          <div className="mt-auto pt-6">
            <UserControls />
          </div>
        </div>
      )}

      {/* Mobile Header & Navigation */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-30 h-16 px-4 flex items-center justify-between glass-morphism border-b backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">MalDetector</span>
          </div>
          
          <div className="flex items-center gap-2">
            <UserControls />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 pt-16 glass-morphism backdrop-blur-lg">
                <div className="flex flex-col h-full">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 min-h-screen flex flex-col",
        isMobile ? "pt-16" : ""
      )}>
        <div className="flex-1 px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
