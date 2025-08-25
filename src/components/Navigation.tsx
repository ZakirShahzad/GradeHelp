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
    <nav className="bg-surface-elevated border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">GradeAI</h1>
                <p className="text-xs text-muted-foreground">Teacher Assistant</p>
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
                  className="relative"
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-2 h-5 px-2 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
            
            <div className="flex items-center space-x-3 pl-3 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">Ms. Johnson</p>
                <p className="text-xs text-muted-foreground">English Teacher</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-shrink-0 relative"
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="mr-1 h-3 w-3" />
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-1 h-4 px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
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