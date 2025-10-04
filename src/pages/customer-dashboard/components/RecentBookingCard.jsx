import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentBookingCard = ({ booking }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'completed': return 'bg-primary text-primary-foreground';
      case 'cancelled': return 'bg-error text-error-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'plumber': return 'Wrench';
      case 'carpenter': return 'Hammer';
      case 'electrician': return 'Zap';
      default: return 'Settings';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = () => {
    navigate('/customer-booking-history', { state: { selectedBooking: booking?.id } });
  };

  const handleTrackService = () => {
    // Track service functionality
    console.log('Tracking service:', booking?.id);
  };

  const handleRateService = () => {
    // Rate service functionality
    console.log('Rating service:', booking?.id);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-subtle transition-micro">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-primary">
          <Icon name={getServiceIcon(booking?.serviceType)} size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-medium text-foreground">
                {booking?.serviceName}
              </h4>
              <p className="text-xs text-muted-foreground">
                {formatDate(booking?.scheduledDate)}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking?.status)}`}>
              {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
              {booking?.technician?.name?.charAt(0)}
            </div>
            <span className="text-xs text-muted-foreground">
              {booking?.technician?.name}
            </span>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={12} className="text-yellow-500" />
              <span className="text-xs text-muted-foreground">
                {booking?.technician?.rating}
              </span>
            </div>
            {booking?.totalCost && (
              <div className="ml-auto text-xs font-medium text-foreground">
                ${booking.totalCost}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="xs" 
              onClick={handleViewDetails}
              iconName="Eye"
              iconSize={12}
            >
              View
            </Button>
            
            {booking?.status === 'in-progress' && (
              <Button 
                variant="ghost" 
                size="xs" 
                onClick={handleTrackService}
                iconName="MapPin"
                iconSize={12}
              >
                Track
              </Button>
            )}
            
            {booking?.status === 'completed' && !booking?.rated && (
              <Button 
                variant="ghost" 
                size="xs" 
                onClick={handleRateService}
                iconName="Star"
                iconSize={12}
              >
                Rate
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBookingCard;