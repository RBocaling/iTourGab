import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Settings, Heart, Calendar, MapPin, Camera, 
  Edit3, Bell, Shield, HelpCircle, LogOut, Star,
  ChevronRight, Mail, Phone, Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const ProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleNotifications = (enabled: boolean) => {
    setNotifications(enabled);
    updateUser({
      preferences: {
        ...user?.preferences,
        notifications: enabled
      }
    });
  };

  const stats = [
    { label: 'Places Visited', value: '12', icon: MapPin },
    { label: 'Photos Taken', value: '143', icon: Camera },
    { label: 'Reviews Written', value: '8', icon: Star },
    { label: 'Trips Planned', value: '5', icon: Calendar }
  ];

  const menuItems = [
    { 
      icon: Heart, 
      label: 'My Favorites', 
      description: 'Saved destinations',
      action: () => navigate('/app/favorites'),
      color: 'text-red-500'
    },
    { 
      icon: Calendar, 
      label: 'My Itineraries', 
      description: 'Planned trips',
      action: () => navigate('/app/itinerary'),
      color: 'text-blue-500'
    },
    { 
      icon: Award, 
      label: 'My Bookings', 
      description: 'Reservation history',
      action: () => {},
      color: 'text-green-500'
    },
    { 
      icon: Camera, 
      label: 'Photo Gallery', 
      description: 'My travel photos',
      action: () => {},
      color: 'text-purple-500'
    }
  ];

  const settingsItems = [
    { 
      icon: Bell, 
      label: 'Notifications', 
      description: 'Push notifications',
      action: () => {},
      hasToggle: true,
      toggleValue: notifications,
      onToggle: toggleNotifications
    },
    { 
      icon: Shield, 
      label: 'Privacy & Security', 
      description: 'Account security',
      action: () => {}
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      description: 'Get assistance',
      action: () => {}
    },
    { 
      icon: Settings, 
      label: 'App Settings', 
      description: 'Preferences',
      action: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-5 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <Avatar className="w-28 h-28 border-4 border-primary">
              <AvatarImage src={user?.profile?.avatar} alt={user?.profile?.name} />
              <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                {user?.profile?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{user?.profile?.name}</h1>
          <p className="text-muted-foreground mb-2">{user?.profile?.email}</p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="capitalize bg-gradient-primary text-white">
              {user?.role}
            </Badge>
            <Badge variant="outline">
              <MapPin className="w-3 h-3 mr-1" />
              {user?.profile?.location}
            </Badge>
          </div>
          
          {user?.profile?.bio && (
            <p className="text-muted-foreground mt-4 max-w-md mx-auto">
              {user.profile.bio}
            </p>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 text-center glass-card">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{user?.profile?.email}</p>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                </div>
              </div>
              {user?.profile?.phone && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{user.profile.phone}</p>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                  </div>
                </div>
              )}
            </div>
            <Button variant="outline" className="mt-4 w-full md:w-auto">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={item.action}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-muted group-hover:scale-110 transition-transform ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Settings & Preferences
            </h2>
            <div className="space-y-1">
              {settingsItems.map((item, index) => (
                <div key={index}>
                  <div
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
                    onClick={item.action}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {item.hasToggle && item.onToggle ? (
                      <Switch
                        checked={item.toggleValue}
                        onCheckedChange={item.onToggle}
                      />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                  {index < settingsItems.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;