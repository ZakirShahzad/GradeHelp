import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  Brain, 
  Home, 
  Upload, 
  FileText, 
  Settings, 
  HelpCircle,
  User,
  LogOut
} from 'lucide-react';

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab = 'dashboard',
  onTabChange = () => {}
}) => {
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Grade', icon: Upload },
    { id: 'assignments', label: 'Assignments', icon: FileText, badge: '3' },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bg-surface-elevated/95 border-b border-border sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 gradient-primary rounded-lg shadow-glow">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">GradeHelp</h1>
                <p className="text-xs text-muted-foreground font-medium">Teacher Assistant</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className="relative px-4 py-2 font-medium transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-2 h-4 px-2 text-xs animate-pulse"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-3 pl-3 border-l border-border">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-foreground">Teacher</p>
                <p className="text-xs text-muted-foreground">GradeHelp User</p>
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20">
                  <User className="h-4 w-4 text-primary" />
                </Button>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border border-surface-elevated"></div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 pt-1">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-shrink-0 relative px-3 py-1.5"
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="mr-1.5 h-3 w-3" />
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-1.5 h-3 px-1 text-xs animate-pulse"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;