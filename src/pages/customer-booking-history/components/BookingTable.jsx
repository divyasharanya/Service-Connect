import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingTable = ({ bookings, onViewDetails, onRebook, onRate, onContact, onCancel, onReschedule }) => {
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
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-foreground">Service</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Technician</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Date & Time</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Cost</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking, index) => (
              <tr key={booking?.id} className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-micro ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                      <Icon name={getServiceIcon(booking?.serviceType)} size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{booking?.serviceType}</div>
                      <div className="text-sm text-muted-foreground">#{booking?.id}</div>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-foreground">{booking?.technicianName}</div>
                    {booking?.rating && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Icon name="Star" size={12} className="text-warning fill-current" />
                        <span className="text-xs text-muted-foreground">{booking?.rating}</span>
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div>
                    <div className="text-foreground">{formatDate(booking?.date)}</div>
                    <div className="text-sm text-muted-foreground">{formatTime(booking?.time)}</div>
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
                    {booking?.status}
                  </span>
                </td>
                
                <td className="py-4 px-4">
                  <span className="font-medium text-foreground">${booking?.totalCost}</span>
                </td>
                
                <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(booking)}
                        iconName="Eye"
                        iconSize={14}
                        className="h-8 w-8 p-0"
                      />
                      {['pending','confirmed'].includes((booking?.status || '').toLowerCase()) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancel(booking)}
                          iconName="X"
                          iconSize={14}
                          className="h-8 w-8 p-0"
                        />
                      )}
                      {['pending','confirmed'].includes((booking?.status || '').toLowerCase()) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReschedule(booking)}
                          iconName="Calendar"
                          iconSize={14}
                          className="h-8 w-8 p-0"
                        />
                      )}
                      
                      {booking?.status === 'completed' && !booking?.rated && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRate(booking)}
                          iconName="Star"
                          iconSize={14}
                          className="h-8 w-8 p-0"
                        />
                      )}
                      
                      {booking?.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRebook(booking)}
                          iconName="RotateCcw"
                          iconSize={14}
                          className="h-8 w-8 p-0"
                        />
                      )}
                      
                      {(booking?.status === 'confirmed' || booking?.status === 'in-progress') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onContact(booking)}
                          iconName="MessageCircle"
                          iconSize={14}
                          className="h-8 w-8 p-0"
                        />
                      )}
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;