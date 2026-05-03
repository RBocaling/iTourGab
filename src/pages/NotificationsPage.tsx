import React from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BackButton from "@/components/ui/BackButton";
import { useNotifications } from "@/hooks/useNotifications";
import Loader from "@/components/loader/Loader";
import { cn } from "@/lib/utils";

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    isLoading,
    isError,
    unreadCount,
    markRead,
    markAllRead,
  } = useNotifications();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen md:mt-14 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10 md:mt-4">
        <div className="flex items-center gap-3 mb-6">
          <BackButton />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {notifications.length > 0 && unreadCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 rounded-full"
              disabled={markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          )}
        </div>

        {isError && (
          <p className="text-sm text-destructive mb-4">
            Could not load notifications. Pull to refresh or try again later.
          </p>
        )}

        {notifications.length === 0 ? (
          <Card className="p-10 text-center border-dashed">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No notifications yet
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              When you receive updates about bookings, trips, or the app,
              they will appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((n: any, index: number) => {
              const isUnread = !n.is_read;
              const title = n.name ?? n.title ?? "Notification";
              const description =
                n.description ?? n.message ?? n.body ?? "";
              const created =
                n.created_at ?? n.createdAt ?? n.updated_at ?? null;

              return (
                <motion.div
                  key={n.id ?? index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card
                    className={cn(
                      "p-4 cursor-pointer transition-colors border",
                      isUnread
                        ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                        : "hover:bg-muted/40",
                    )}
                    onClick={() => {
                      if (isUnread && n.id != null) {
                        markRead.mutate(n.id);
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <span
                        className={cn(
                          "mt-1.5 w-2 h-2 rounded-full shrink-0",
                          isUnread ? "bg-primary" : "bg-transparent",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-sm leading-snug">
                          {title}
                        </h2>
                        {description ? (
                          <p className="text-sm text-muted-foreground mt-1.5 whitespace-pre-wrap">
                            {description}
                          </p>
                        ) : null}
                        {created ? (
                          <p className="text-[11px] text-muted-foreground mt-2">
                            {new Date(created).toLocaleString()}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
