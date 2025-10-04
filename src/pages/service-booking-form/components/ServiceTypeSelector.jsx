import React from 'react';
import Icon from '../../../components/AppIcon';

const ServiceTypeSelector = ({ selectedService, onServiceSelect, services }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Select Service Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services?.map((service) => (
          <div
            key={service?.id}
            onClick={() => onServiceSelect(service)}
            className={`p-4 border rounded-lg cursor-pointer transition-micro ${
              selectedService?.id === service?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedService?.id === service?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Icon name={service?.icon} size={20} />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{service?.name}</h4>
                <p className="text-sm text-muted-foreground">{service?.description}</p>
                <p className="text-sm font-medium text-primary mt-1">
                  Starting from ${service?.basePrice}/hr
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceTypeSelector;