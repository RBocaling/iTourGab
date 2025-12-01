import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  MapPin,
  Calendar,
  Heart,
  User,
  Settings,
  LogOut,
  Bell,
  Medal,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth2 } from "@/hooks/useAuth";

const DesktopNavigation = () => {
  const { logout, user } = useAuth2();
  const location = useLocation();
  const navigate = useNavigate();

  console.log("user", user);

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "map", label: "Explore Map", icon: MapPin, path: "/map" },
    {
      id: "touristspotranking",
      label: "Top Spots",
      icon: Medal,
      path: "/ranking-spot",
    },
    { id: "bookings", label: "My Bookings", icon: Calendar, path: "/bookings" },
    { id: "favorites", label: "Favorites", icon: Heart, path: "/favorites" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gradient-primary"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className=" bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <img src="/logo-itour.png" className="w-14" alt="" />
              </motion.div>
            </motion.div>
            <p className="text-xl font-bold -translate-x-3">iTourGab</p>
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
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
                  <span className="font-medium relative z-10">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </div>
            </Button>

            <div className="h-6 w-px bg-border" />

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={user?.profile?.avatar}
                  alt={user?.firstName}
                />
                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                  {user?.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium capitalize">{`${user?.name}`}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
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
