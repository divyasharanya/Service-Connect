import React from 'react';
import Icon from '../../../components/AppIcon';

const PriceEstimation = ({ 
  selectedService, 
  selectedTechnician, 
  estimatedDuration, 
  urgency 
}) => {
  const calculateEstimate = () => {
    if (!selectedService || !estimatedDuration) return null;

    const baseRate = selectedTechnician?.hourlyRate || selectedService?.basePrice;
    const hours = parseInt(estimatedDuration);
    const baseTotal = baseRate * hours;

    // Urgency multiplier
    const urgencyMultipliers = {
      low: 1,
      medium: 1.1,
      high: 1.25,
      emergency: 1.5
    };

    const urgencyMultiplier = urgencyMultipliers?.[urgency] || 1;
    const subtotal = baseTotal * urgencyMultiplier;
    const serviceFee = 15;
    const tax = subtotal * 0.08;
    const total = subtotal + serviceFee + tax;

    return {
      baseRate,
      hours,
      baseTotal,
      urgencyMultiplier,
      subtotal,
      serviceFee,
      tax,
      total
    };
  };

  const estimate = calculateEstimate();

  if (!estimate) {
    return (
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <div className="text-center text-muted-foreground">
          <Icon name="Calculator" size={32} className="mx-auto mb-3" />
          <h4 className="font-medium mb-2">Price Estimation</h4>
          <p className="text-sm">
            Complete service details to see price estimate
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Calculator" size={20} className="text-primary" />
        <h4 className="font-semibold text-foreground">Price Estimate</h4>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Service Rate (${estimate?.baseRate}/hr × {estimate?.hours}h)
          </span>
          <span className="text-foreground">${estimate?.baseTotal?.toFixed(2)}</span>
        </div>

        {estimate?.urgencyMultiplier > 1 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Urgency Fee ({Math.round((estimate?.urgencyMultiplier - 1) * 100)}%)
            </span>
            <span className="text-foreground">
              +${(estimate?.subtotal - estimate?.baseTotal)?.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service Fee</span>
          <span className="text-foreground">${estimate?.serviceFee?.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="text-foreground">${estimate?.tax?.toFixed(2)}</span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total Estimate</span>
            <span className="font-semibold text-lg text-primary">
              ${estimate?.total?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-muted/50 rounded-md">
        <p className="text-xs text-muted-foreground">
          <Icon name="Info" size={12} className="inline mr-1" />
          This is an estimate. Final price may vary based on actual work completed.
        </p>
      </div>
    </div>
  );
};

export default PriceEstimation;