import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleSelectionCard = ({ role, title, description, features, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(role)}
      className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-elevated'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-subtle'
      }`}
    >
      {/* Selection Indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            isSelected
              ? 'border-primary bg-primary' :'border-muted-foreground'
          }`}
        >
          {isSelected && <Icon name="Check" size={12} color="white" />}
        </div>
      </div>
      {/* Role Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
        <Icon 
          name={role === 'customer' ? 'User' : 'Wrench'} 
          size={24} 
        />
      </div>
      {/* Role Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      {/* Role Description */}
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>
      {/* Features List */}
      <ul className="space-y-2">
        {features?.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Check" size={14} className="text-accent flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleSelectionCard;