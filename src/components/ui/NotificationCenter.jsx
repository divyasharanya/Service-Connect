import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ userRole = 'customer', isOpen = false, onToggle }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications based on user role
  useEffect(() => {
    const mockNotifications = {
      customer: [
        {
          id: 1,
          type: 'booking_confirmed',
          title: 'Booking Confirmed',
          message: 'Your plumbing service is scheduled for tomorrow at 2:00 PM',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          icon: 'CheckCircle',
          priority: 'normal'
        },
        {
          id: 2,
          type: 'technician_assigned',
          title: 'Technician Assigned',
          message: 'John Smith has been assigned to your electrical repair',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
          icon: 'User',
          priority: 'normal'
        },
        {
          id: 3,
          type: 'service_completed',
          title: 'Service Completed',
          message: 'Your HVAC maintenance has been completed. Please rate your experience.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
          icon: 'Star',
          priority: 'low'
        }
      ],
      admin: [
        {
          id: 1,
          type: 'new_booking',
          title: 'New Booking Request',
          message: '5 new service requests require technician assignment',
          timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
          read: false,
          icon: 'Calendar',
          priority: 'high'
        },
        {
          id: 2,
          type: 'technician_verification',
          title: 'Technician Verification',
          message: '3 technicians pending background check approval',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          read: false,
          icon: 'Shield',
          priority: 'high'
        },
        {
          id: 3,
          type: 'system_alert',
          title: 'System Performance',
          message: 'Platform response time improved by 15% this week',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          read: true,
          icon: 'TrendingUp',
          priority: 'low'
        }
      ]
    };

    const roleNotifications = mockNotifications?.[userRole] || [];
    setNotifications(roleNotifications);
    setUnreadCount(roleNotifications?.filter(n => !n?.read)?.length);
  }, [userRole]);

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
    setNotifications(prev => 
      prev?.map(notification => 
        notification?.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev?.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
    const notification = notifications?.find(n => n?.id === notificationId);
    if (notification && !notification?.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
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