import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingDetailsModal = ({ booking, isOpen, onClose, onRebook, onRate, onContact }) => {
  if (!isOpen || !booking) return null;

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < rating ? "text-warning fill-current" : "text-muted-foreground"}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-floating max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <Icon name={getServiceIcon(booking?.serviceType)} size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{booking?.serviceType}</h2>
              <p className="text-muted-foreground">Booking #{booking?.id}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="h-8 w-8 p-0"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking?.status)}`}>
                    {booking?.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Cost</label>
                <p className="text-2xl font-bold text-foreground">${booking?.totalCost}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                <p className="text-foreground">{formatDate(booking?.date)}</p>
                <p className="text-foreground">{formatTime(booking?.time)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Duration</label>
                <p className="text-foreground">{booking?.duration || '2 hours'}</p>
              </div>
            </div>
          </div>

          {/* Technician Info */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Technician Details</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                {booking?.technicianName?.split(' ')?.map(n => n?.[0])?.join('')}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{booking?.technicianName}</p>
                <p className="text-sm text-muted-foreground">{booking?.technicianPhone || '+1 (555) 123-4567'}</p>
                {booking?.rating && (
                  <div className="flex items-center space-x-1 mt-1">
                    {renderStars(Math.floor(booking?.rating))}
                    <span className="text-sm text-muted-foreground ml-1">{booking?.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Service Address</label>
            <div className="flex items-start space-x-2 mt-1">
              <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5" />
              <p className="text-foreground">{booking?.address}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Service Description</label>
            <p className="text-foreground mt-1">{booking?.description}</p>
          </div>

          {/* Completion Notes */}
          {booking?.completionNotes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Completion Notes</label>
              <p className="text-foreground mt-1">{booking?.completionNotes}</p>
            </div>
          )}

          {/* Customer Rating */}
          {booking?.customerRating && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Your Rating</label>
              <div className="flex items-center space-x-2 mt-1">
                {renderStars(booking?.customerRating)}
                <span className="text-foreground">{booking?.customerRating}/5</span>
              </div>
              {booking?.customerReview && (
                <p className="text-muted-foreground mt-2 text-sm">{booking?.customerReview}</p>
              )}
            </div>
          )}

          {/* Payment Details */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="text-foreground">${booking?.serviceFee || (booking?.totalCost * 0.9)?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="text-foreground">${booking?.platformFee || (booking?.totalCost * 0.1)?.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-medium">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${booking?.totalCost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 p-6 border-t border-border">
          {booking?.status === 'completed' && !booking?.rated && (
            <Button
              variant="default"
              onClick={() => onRate(booking)}
              iconName="Star"
              iconPosition="left"
              iconSize={16}
            >
              Rate Service
            </Button>
          )}
          
          {booking?.status === 'completed' && (
            <Button
              variant="outline"
              onClick={() => onRebook(booking)}
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={16}
            >
              Book Again
            </Button>
          )}
          
          {(booking?.status === 'confirmed' || booking?.status === 'in-progress') && (
            <Button
              variant="outline"
              onClick={() => onContact(booking)}
              iconName="MessageCircle"
              iconPosition="left"
              iconSize={16}
            >
              Contact Technician
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => window.print()}
            iconName="Printer"
            iconPosition="left"
            iconSize={16}
          >
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;