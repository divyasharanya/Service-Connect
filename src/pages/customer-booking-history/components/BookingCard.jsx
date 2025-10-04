import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingCard = ({ booking, onViewDetails, onRebook, onRate, onContact, onCancel, onReschedule }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'confirmed': return 'bg-primary text-primary-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-error text-error-foreground';
      case 'pending': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType?.toLowerCase()) {
      case 'plumbing': return 'Wrench';
      case 'electrical': return 'Zap';
      case 'carpentry': return 'Hammer';
      case 'hvac': return 'Wind';
      case 'painting': return 'Paintbrush';
      default: return 'Tool';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-subtle hover:shadow-elevated transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name={getServiceIcon(booking?.serviceType)} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{booking?.serviceType}</h3>
            <p className="text-sm text-muted-foreground">#{booking?.id}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
          {booking?.status}
        </span>
      </div>
      {/* Service Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="User" size={16} className="text-muted-foreground" />
          <span className="text-foreground">{booking?.technicianName}</span>
          {booking?.rating && (
            <div className="flex items-center space-x-1 ml-2">
              <Icon name="Star" size={14} className="text-warning fill-current" />
              <span className="text-sm text-muted-foreground">{booking?.rating}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <span className="text-foreground">{formatDate(booking?.date)}</span>
          <span className="text-muted-foreground">at {formatTime(booking?.time)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="MapPin" size={16} className="text-muted-foreground" />
          <span className="text-foreground truncate">{booking?.address}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="DollarSign" size={16} className="text-muted-foreground" />
          <span className="font-medium text-foreground">${booking?.totalCost}</span>
        </div>
      </div>
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {booking?.description}
      </p>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(booking)}
          iconName="Eye"
          iconPosition="left"
          iconSize={14}
        >
          Details
        </Button>

        {['pending','confirmed'].includes((booking?.status || '').toLowerCase()) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(booking)}
            iconName="X"
            iconPosition="left"
            iconSize={14}
          >
            Cancel
          </Button>
        )}

        {['pending','confirmed'].includes((booking?.status || '').toLowerCase()) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReschedule(booking)}
            iconName="Calendar"
            iconPosition="left"
            iconSize={14}
          >
            Reschedule
          </Button>
        )}
        
        {booking?.status === 'completed' && !booking?.rated && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRate(booking)}
            iconName="Star"
            iconPosition="left"
            iconSize={14}
          >
            Rate
          </Button>
        )}
        
        {booking?.status === 'completed' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRebook(booking)}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={14}
          >
            Rebook
          </Button>
        )}
        
        {(booking?.status === 'confirmed' || booking?.status === 'in-progress') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onContact(booking)}
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={14}
          >
            Contact
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;