import React from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, Calendar, Heart, User, BookOpenCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/app" },

    {
      id: "bookings",
      label: "Bookings",
      icon: BookOpenCheck,
      path: "/app/bookings",
    },

    {
      id: "map",
      label: "Map",
      box: "/map-box.png",
      img: "/locate.webp",
      path: "/app/map",
    },
    { id: "favorites", label: "Saved", icon: Heart, path: "/app/favorites" },
    { id: "profile", label: "Profile", icon: User, path: "/app/profile" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="bottom-nav md:hidden border-t border-primary/40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className="relative flex flex-col  items-center justify-center pb-2 pt-1 px-3 min-w-0 flex-1"
            >
              {/* Active Indicator */}
              {isActive && !item.box&& (
                <motion.div
                  // layoutId="activeTab"
                  className="absolute -top-1 left-1/2  -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}

              {item?.box ? (
                <div className='flex flex-col items-center justify-center '>
                  <img src={item.img} alt="" className='w-8 animate-bounce' />
                  {/* <img src={item.box} alt="" className='w-7' /> */}
                </div>
              ) : (
                <div
                  className={`relative p-2 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                  />

                  {/* Glow Effect for Active */}
                  {isActive && !item.img && (
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2  bg-primary/20 rounded-2xl blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              )}

              {/* Label */}
              <span
                className={`text-xs font-medium transition-colors duration-200 ${
                  item.box ? "text-primary -translate-y-2 mt-2":isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;