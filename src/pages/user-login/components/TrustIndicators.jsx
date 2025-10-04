import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: 'CheckCircle',
      title: 'Verified Platform',
      description: 'Trusted by thousands of users'
    },
    {
      icon: 'Lock',
      title: 'Privacy Protected',
      description: 'We never share your information'
    }
  ];

  return (
    <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Secure & Trusted Login
        </h3>
        <p className="text-xs text-muted-foreground">
          Your security is our top priority
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
              <Icon name={feature?.icon} size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">
                {feature?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustIndicators;