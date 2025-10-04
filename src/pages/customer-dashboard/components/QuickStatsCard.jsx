import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = ({ stat }) => {
  const getStatColor = (type) => {
    switch (type) {
      case 'total-bookings': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'savings': return 'text-purple-600';
      default: return 'text-primary';
    }
  };

  const getStatIcon = (type) => {
    switch (type) {
      case 'total-bookings': return 'Calendar';
      case 'completed': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'savings': return 'DollarSign';
      default: return 'BarChart3';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${getStatColor(stat?.type)}`}>
          <Icon name={getStatIcon(stat?.type)} size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {stat?.label}
          </p>
          <p className="text-lg font-semibold text-foreground">
            {stat?.value}
          </p>
          {stat?.change && (
            <div className={`flex items-center space-x-1 text-xs ${
              stat?.change?.type === 'increase' ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={stat?.change?.type === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={12} 
              />
              <span>{stat?.change?.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard;