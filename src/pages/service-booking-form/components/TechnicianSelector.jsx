import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';


const TechnicianSelector = ({ 
  technicians, 
  selectedTechnician, 
  onTechnicianSelect,
  autoMatch,
  onAutoMatchToggle 
}) => {
  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={i < Math.floor(rating) ? "Star" : "Star"}
        size={14}
        className={i < Math.floor(rating) ? "text-warning fill-current" : "text-muted-foreground"}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Select Technician</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoMatch"
            checked={autoMatch}
            onChange={(e) => onAutoMatchToggle(e?.target?.checked)}
            className="rounded border-border"
          />
          <label htmlFor="autoMatch" className="text-sm text-foreground">
            Auto-match best available
          </label>
        </div>
      </div>
      {!autoMatch && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicians?.map((technician) => (
            <div
              key={technician?.id}
              onClick={() => onTechnicianSelect(technician)}
              className={`p-4 border rounded-lg cursor-pointer transition-micro ${
                selectedTechnician?.id === technician?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Image
                    src={technician?.avatar}
                    alt={technician?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    technician?.isAvailable ? 'bg-success' : 'bg-muted-foreground'
                  }`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground truncate">
                      {technician?.name}
                    </h4>
                    <span className="text-sm font-medium text-primary">
                      ${technician?.hourlyRate}/hr
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 mt-1">
                    {getRatingStars(technician?.rating)}
                    <span className="text-sm text-muted-foreground ml-1">
                      {technician?.rating} ({technician?.reviewCount} reviews)
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {technician?.experience} years experience
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {technician?.distance} miles away
                      </span>
                    </div>
                    
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      technician?.isAvailable 
                        ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                    }`}>
                      {technician?.isAvailable ? 'Available' : 'Busy'}
                    </div>
                  </div>
                  
                  {technician?.specialties && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {technician?.specialties?.slice(0, 2)?.map((specialty, index) => (
                        <span
                          key={index}
                          className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {autoMatch && (
        <div className="p-6 border border-dashed border-border rounded-lg text-center">
          <Icon name="Zap" size={32} className="mx-auto mb-3 text-primary" />
          <h4 className="font-medium text-foreground mb-2">Auto-Match Enabled</h4>
          <p className="text-sm text-muted-foreground">
            We'll automatically assign the best available technician based on your location, 
            service type, and technician ratings.
          </p>
        </div>
      )}
    </div>
  );
};

export default TechnicianSelector;