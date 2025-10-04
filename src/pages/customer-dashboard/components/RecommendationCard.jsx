import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendationCard = ({ recommendation }) => {
  const navigate = useNavigate();

  const handleBookService = () => {
    navigate('/service-booking-form', { state: { selectedService: recommendation?.serviceType } });
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'seasonal': return 'Calendar';
      case 'maintenance': return 'Settings';
      case 'popular': return 'TrendingUp';
      case 'emergency': return 'AlertTriangle';
      default: return 'Lightbulb';
    }
  };

  const getRecommendationColor = (type) => {
    switch (type) {
      case 'seasonal': return 'text-blue-600';
      case 'maintenance': return 'text-green-600';
      case 'popular': return 'text-purple-600';
      case 'emergency': return 'text-red-600';
      default: return 'text-primary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-subtle transition-micro">
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${getRecommendationColor(recommendation?.type)}`}>
          <Icon name={getRecommendationIcon(recommendation?.type)} size={16} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground mb-1">
            {recommendation?.title}
          </h4>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {recommendation?.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded-full">
                {recommendation?.category}
              </span>
              {recommendation?.discount && (
                <span className="px-2 py-1 bg-success text-success-foreground rounded-full">
                  {recommendation?.discount}% off
                </span>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="xs" 
              onClick={handleBookService}
              iconName="ArrowRight"
              iconSize={12}
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;