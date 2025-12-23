import { Bell, Globe, MailSearch, Search } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const MobileHeader = () => {
    const {
      notifications,
      unreadCount,
      isLoading: notifLoading,
    } = useNotifications();
  return (
    <div className="mobile-header  lg:hidden fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-2">
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
      <div className="flex items-center gap-5 pr-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-7 h-7" />
              {!notifLoading && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={12}
            className="w-[360px] rounded-3xl p-0 shadow-xl border bg-white"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="font-semibold text-sm">Notifications</div>
              {unreadCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {/* Body */}
            <ScrollArea className="max-h-[420px]">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((n: any) => {
                    const isUnread = !n.is_read;

                    return (
                      <motion.div
                        key={n.id}
                        initial={isUnread ? { x: [-6, 6, -4, 4, 0] } : false}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.35 }}
                        className={cn(
                          "px-4 py-3 cursor-pointer transition",
                          isUnread
                            ? "bg-primary/5 hover:bg-primary/10"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div className="flex gap-3">
                          {/* Dot */}
                          <span
                            className={cn(
                              "mt-2 w-2 h-2 rounded-full",
                              isUnread ? "bg-primary" : "bg-transparent"
                            )}
                          />

                          {/* Content */}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{n.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {n.description}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-1">
                              {new Date(n.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

           
          </PopoverContent>
        </Popover>

        <Link to="/gabaldon-public-socials">
          <Globe size={23} className="text-gray-400" />{" "}
        </Link>
      </div>
    </div>
  );
}

export default MobileHeader
