import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceCategoryCard = ({ service }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/service-booking-form', { state: { selectedService: service?.id } });
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'plumber': return 'Wrench';
      case 'carpenter': return 'Hammer';
      case 'electrician': return 'Zap';
      default: return 'Settings';
    }
  };

  const getServiceColor = (serviceType) => {
    switch (serviceType) {
      case 'plumber': return 'text-blue-600';
      case 'carpenter': return 'text-amber-600';
      case 'electrician': return 'text-yellow-600';
      default: return 'text-primary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevated transition-smooth group">
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${getServiceColor(service?.type)} group-hover:scale-110 transition-smooth`}>
          <Icon name={getServiceIcon(service?.type)} size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {service?.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {service?.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={14} />
                <span>{service?.availableTechnicians} available</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} />
                <span>{service?.rating}</span>
              </div>
            </div>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleBookNow}
              iconName="Calendar"
              iconPosition="left"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoryCard;