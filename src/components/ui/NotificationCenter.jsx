import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Icon from '../AppIcon';
import Button from './Button';
import { removeToast } from '../../features/notifications/notificationsSlice';


const NotificationCenter = ({ userRole = 'customer', isOpen = false, onToggle }) => {
  const dispatch = useDispatch();
  const toasts = useSelector((s) => s.notifications.toasts);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readIds, setReadIds] = useState(new Set());

  // Derive notifications from Redux toasts
  useEffect(() => {
    const mapped = (toasts || []).map((t) => ({
      id: t.id,
      type: t.type,
      title: t.title || (t.type === 'error' ? 'Error' : t.type === 'success' ? 'Success' : t.type === 'warning' ? 'Warning' : 'Notification'),
      message: t.message,
      timestamp: t.timestamp || Date.now(),
      icon: t.type === 'error' ? 'AlertTriangle' : t.type === 'success' ? 'CheckCircle' : t.type === 'warning' ? 'AlertCircle' : 'Info',
      priority: t.type === 'error' ? 'high' : t.type === 'warning' ? 'normal' : 'low',
      read: readIds.has(t.id),
    }));

    // Ensure readIds only contains existing toasts
    const existingIds = new Set(mapped.map((n) => n.id));
    setReadIds((prev) => new Set([...prev].filter((id) => existingIds.has(id))));

    setNotifications(mapped);
    setUnreadCount(mapped.filter((n) => !n.read).length);
  }, [toasts, readIds]);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'normal': return 'text-primary';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const markAsRead = (notificationId) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(notificationId);
      return next;
    });
  };

  const markAllAsRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const clearNotification = (notificationId) => {
    dispatch(removeToast(notificationId));
    setReadIds((prev) => {
      const next = new Set(prev);
      next.delete(notificationId);
      return next;
    });
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="relative"
        iconName="Bell"
        iconSize={18}
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-floating z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-popover-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="xs"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications?.map((notification) => (
                <div
                  key={notification?.id}
                  className={`p-4 border-b border-border last:border-b-0 hover:bg-muted transition-micro cursor-pointer ${
                    !notification?.read ? 'bg-muted/50' : ''
                  }`}
                  onClick={() => markAsRead(notification?.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 ${getPriorityColor(notification?.priority)}`}>
                      <Icon name={notification?.icon} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-popover-foreground truncate">
                          {notification?.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e?.stopPropagation();
                            clearNotification(notification?.id);
                          }}
                          className="text-muted-foreground hover:text-foreground transition-micro"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification?.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification?.timestamp)}
                        </span>
                        {!notification?.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications?.length > 0 && (
            <div className="p-3 border-t border-border bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="text-xs"
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;