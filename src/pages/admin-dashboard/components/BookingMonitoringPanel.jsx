import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingMonitoringPanel = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const bookings = useSelector((s) => s.bookings.items);

  const realtimeBookings = useMemo(() => {
    // Map our bookings shape to panel cards
    return bookings.map((b) => ({
      id: b.id,
      customer: b.customerName,
      service: b.serviceName,
      technician: b.technicianName || 'Unassigned',
      status: b.status === 'accepted' ? 'in_progress' : b.status,
      location: b.location,
      scheduledTime: new Date(b.date).toLocaleTimeString(),
      estimatedDuration: '2 hours',
      priority: b.status === 'pending' ? 'high' : 'normal',
      timestamp: new Date(b.date),
    }));
  }, [bookings]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'confirmed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'in_progress':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return { icon: 'AlertTriangle', color: 'text-error' };
      case 'normal':
        return { icon: 'Clock', color: 'text-muted-foreground' };
      case 'low':
        return { icon: 'Minus', color: 'text-muted-foreground' };
      default:
        return { icon: 'Clock', color: 'text-muted-foreground' };
    }
  };

  const getServiceIcon = (service) => {
    switch (service?.toLowerCase()) {
      case 'plumbing':
        return 'Droplets';
      case 'electrical':
        return 'Zap';
      case 'carpentry':
        return 'Hammer';
      default:
        return 'Wrench';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Real-time Booking Monitor</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
            <Button variant="outline" size="sm" iconName="RefreshCw">
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Active Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-warning">3</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-success">8</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-error">1</p>
            <p className="text-xs text-muted-foreground">Issues</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Recent Activity */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {realtimeBookings?.map((booking) => {
            const priorityInfo = getPriorityIcon(booking?.priority);
            return (
              <div key={booking?.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-micro">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Icon name={getServiceIcon(booking?.service)} size={20} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-foreground">
                        {booking?.id}
                      </h4>
                      <Icon name={priorityInfo?.icon} size={14} className={priorityInfo?.color} />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking?.status)}`}>
                      {booking?.status?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <Icon name="User" size={14} />
                      <span>{booking?.customer}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span>{booking?.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Wrench" size={14} />
                      <span>{booking?.technician}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{booking?.scheduledTime} ({booking?.estimatedDuration})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Updated {formatTimestamp(booking?.timestamp)}
                    </span>
                    
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="xs" iconName="Eye">
                        View
                      </Button>
                      <Button variant="ghost" size="xs" iconName="MessageSquare">
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Geographic Distribution */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-4">Geographic Distribution</h4>
          <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Service Area Map"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=40.7128,-74.0060&z=11&output=embed"
              className="rounded-lg"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button variant="outline" fullWidth>
            View Detailed Booking Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingMonitoringPanel;