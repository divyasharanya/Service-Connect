import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { removeToast } from '../../features/notifications/notificationsSlice';
import { getBookings, getTechnicianByUserId } from '../../utils/api';
import { io } from 'socket.io-client';


const NotificationCenter = ({ userRole = 'customer', isOpen = false, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toasts = useSelector((s) => s.notifications.toasts);
  const user = useSelector((s) => s.auth.user);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readIds, setReadIds] = useState(new Set());
  const [serverFeed, setServerFeed] = useState([]); // notifications derived from backend bookings
  const [techId, setTechId] = useState(null);

  // Load persisted readIds
  useEffect(() => {
    try {
      const raw = localStorage.getItem('notificationReadIds_v1');
      if (raw) setReadIds(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  // Persist readIds
  useEffect(() => {
    try {
      localStorage.setItem('notificationReadIds_v1', JSON.stringify(Array.from(readIds)));
    } catch {}
  }, [readIds]);

  // Resolve technician id when needed
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (user?.role === 'technician' && user?.id) {
        try {
          const t = await getTechnicianByUserId(user.id);
          if (mounted) setTechId(t?.id || null);
        } catch {
          if (mounted) setTechId(null);
        }
      } else {
        setTechId(null);
      }
    })();
    return () => { mounted = false; };
  }, [user?.id, user?.role]);

  // Poll backend bookings and derive notifications (disabled: using sockets only)
  // useEffect(() => {
  //   let timer;
  //   let aborted = false;
  //   async function tick() {
  //     try {
  //       if (!user?.id) { setServerFeed([]); return; }
  //       let params = {};
  //       if (user.role === 'customer') params = { customerId: user.id };
  //       if (user.role === 'technician' && techId) params = { technicianId: techId };
  //       if (Object.keys(params).length === 0) { setServerFeed([]); return; }
  //       const data = await getBookings(params);
  //       const now = Date.now();
  //       const items = (data || []).map((b) => mapBookingToNotification(b, now));
  //       if (!aborted) setServerFeed(items);
  //     } catch {
  //       if (!aborted) setServerFeed([]);
  //     }
  //     timer = setTimeout(tick, 15000);
  //   }
  //   tick();
  //   return () => { aborted = true; if (timer) clearTimeout(timer); };
  // }, [user?.id, user?.role, techId, readIds]);

  // WebSocket: connect to backend and receive real-time booking updates
  useEffect(() => {
    if (!user?.id) return;
    const socket = io(import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || 'http://localhost:4000', {
      transports: ['websocket'],
      reconnection: true,
    });
    const handler = (b) => {
      // Only take relevant updates
      if (user.role === 'customer' && b.customerId !== user.id) return;
      if (user.role === 'technician') {
        if (!techId || b.technicianId !== techId) return;
      }
      const now = Date.now();
      setServerFeed((prev) => {
        const next = [...prev];
        const item = mapBookingToNotification(b, now);
        // Replace matching id if present
        const idx = next.findIndex((n) => n.id === item.id);
        if (idx >= 0) next[idx] = item; else next.unshift(item);
        return next;
      });
    };
    socket.on('booking:update', handler);
    return () => {
      try { socket.off('booking:update', handler); socket.close(); } catch {}
    };
  }, [user?.id, user?.role, techId, readIds]);

  // Helper: map booking to a notification object with click target
  const mapBookingToNotification = (b, nowTs) => {
    const now = nowTs || Date.now();
    const status = (b.status || '').toLowerCase();
    let title = 'Booking Update';
    let message = `${b.serviceName} · ${new Date(b.date).toLocaleString()}`;
    let icon = 'Info';
    let priority = 'low';
    let targetPath = '';
    if (user?.role === 'customer') {
      if (status === 'accepted') { title = 'Technician Accepted'; icon = 'CheckCircle'; priority = 'normal'; }
      if (status === 'completed') { title = 'Service Completed'; icon = 'Star'; priority = 'low'; }
      if (status === 'cancelled' || status === 'rejected') { title = 'Booking Cancelled'; icon = 'XCircle'; priority = 'normal'; }
      targetPath = `/booking-details/${b.id}`;
    } else if (user?.role === 'technician') {
      if (status === 'pending') { title = 'New Job Pending'; icon = 'Bell'; priority = 'high'; }
      if (status === 'in-progress') { title = 'Job In Progress'; icon = 'Timer'; priority = 'normal'; }
      if (status === 'completed') { title = 'Job Completed'; icon = 'CheckCircle'; priority = 'low'; }
      targetPath = `/technician-active-job/${b.id}`;
    }
    return {
      id: `booking_${b.id}_${status}`,
      type: 'booking',
      title,
      message,
      timestamp: new Date(b.date).getTime() || now,
      icon,
      priority,
      read: readIds.has(`booking_${b.id}_${status}`),
      targetPath,
    };
  };

  // Merge Redux toasts with serverFeed
  useEffect(() => {
    const toastMapped = (toasts || []).map((t) => ({
      id: t.id,
      type: t.type,
      title: t.title || (t.type === 'error' ? 'Error' : t.type === 'success' ? 'Success' : t.type === 'warning' ? 'Warning' : 'Notification'),
      message: t.message,
      timestamp: t.timestamp || Date.now(),
      icon: t.type === 'error' ? 'AlertTriangle' : t.type === 'success' ? 'CheckCircle' : t.type === 'warning' ? 'AlertCircle' : 'Info',
      priority: t.type === 'error' ? 'high' : t.type === 'warning' ? 'normal' : 'low',
      read: readIds.has(t.id),
    }));

    // Combine by id (serverFeed may share ids across statuses), prefer most recent timestamp
    const byId = new Map();
    [...serverFeed, ...toastMapped].forEach((n) => {
      const existing = byId.get(n.id);
      if (!existing || (n.timestamp || 0) > (existing.timestamp || 0)) byId.set(n.id, n);
    });

    const merged = Array.from(byId.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    setNotifications(merged);
    setUnreadCount(merged.filter((n) => !n.read).length);
  }, [toasts, serverFeed, readIds]);

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
    // Remove from Redux toasts (no-op if id belongs to serverFeed)
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
                  onClick={() => {
                    markAsRead(notification?.id);
                    if (notification?.targetPath) navigate(notification.targetPath);
                  }}
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