import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';

const MockCredentialsHelper = ({ onCredentialSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mockUsers = [
    {
      role: 'Customer',
      email: 'customer@serviceconnect.com',
      password: 'customer123',
      description: 'Access customer dashboard and booking features',
      icon: 'User',
      color: 'text-primary'
    },
    {
      role: 'Administrator',
      email: 'admin@serviceconnect.com',
      password: 'admin123',
      description: 'Full admin access to manage platform',
      icon: 'Shield',
      color: 'text-error'
    },
    {
      role: 'Technician',
      email: 'technician@serviceconnect.com',
      password: 'tech123',
      description: 'Technician portal for job management',
      icon: 'Wrench',
      color: 'text-accent'
    }
  ];

  const handleCredentialClick = (user) => {
    if (onCredentialSelect) {
      onCredentialSelect(user?.email, user?.password);
    }
  };

  return (
    <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            Demo Credentials
          </span>
        </div>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground mb-3">
            Click on any credential below to auto-fill the login form:
          </p>
          
          {mockUsers?.map((user, index) => (
            <div
              key={index}
              onClick={() => handleCredentialClick(user)}
              className="p-3 bg-card rounded-md border border-border hover:bg-muted/50 cursor-pointer transition-micro"
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 ${user?.color}`}>
                  <Icon name={user?.icon} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {user?.role}
                    </p>
                    <Icon name="Copy" size={12} className="text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {user?.description}
                  </p>
                  <div className="text-xs font-mono text-muted-foreground">
                    <div>{user?.email}</div>
                    <div>{user?.password}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockCredentialsHelper;