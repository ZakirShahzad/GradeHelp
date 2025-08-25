import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Home, 
  Upload, 
  FileText, 
  Settings, 
  HelpCircle,
  User
} from 'lucide-react';

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab = 'dashboard',
  onTabChange = () => {}
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'assignments', label: 'Assignments', icon: FileText, badge: '3' },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bg-surface-elevated/95 border-b border-border sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="p-3 gradient-primary rounded-xl shadow-glow">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">GradeAI</h1>
                <p className="text-sm text-muted-foreground font-medium">Teacher Assistant</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="lg"
                  className="relative px-6 py-3 font-medium transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-3 h-5 px-2 text-xs animate-pulse"
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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="px-4 py-2">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
            
            <div className="flex items-center space-x-4 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">Ms. Johnson</p>
                <p className="text-xs text-muted-foreground">English Teacher</p>
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon" className="rounded-full w-11 h-11 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </Button>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-surface-elevated"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 pt-2">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-shrink-0 relative px-4 py-2"
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-2 h-4 px-1.5 text-xs animate-pulse"
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