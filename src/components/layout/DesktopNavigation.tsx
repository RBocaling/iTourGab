import React from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, Calendar, Heart, User, Settings, LogOut, Bell } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DesktopNavigationProps {
  user: any;
  onLogout: () => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/app' },
    { id: 'map', label: 'Explore Map', icon: MapPin, path: '/app/map' },
    { id: 'bookings', label: 'My Bookings', icon: Calendar, path: '/app/bookings' },
    { id: 'favorites', label: 'Favorites', icon: Heart, path: '/app/favorites' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                iTourGab
              </h1>
              <p className="text-xs text-muted-foreground">Explore Gabaldon</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktopActiveTab"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <item.icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </div>
            </Button>

            <div className="h-6 w-px bg-border" />

            <button
              onClick={() => navigate('/app/profile')}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profile?.avatar} alt={user?.profile?.name} />
                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                  {user?.profile?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{user?.profile?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/app/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopNavigation;