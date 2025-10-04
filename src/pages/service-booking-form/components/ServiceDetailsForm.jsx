import React from 'react';

import Select from '../../../components/ui/Select';

const ServiceDetailsForm = ({ 
  description, 
  onDescriptionChange, 
  urgency, 
  onUrgencyChange,
  estimatedDuration,
  onDurationChange 
}) => {
  const urgencyOptions = [
    { value: 'low', label: 'Low - Within a week' },
    { value: 'medium', label: 'Medium - Within 2-3 days' },
    { value: 'high', label: 'High - Within 24 hours' },
    { value: 'emergency', label: 'Emergency - ASAP' }
  ];

  const durationOptions = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: 'Full day (8 hours)' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Service Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Describe your service needs *
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e?.target?.value)}
            placeholder="Please provide detailed information about the service you need, including any specific requirements or issues..."
            className="w-full h-32 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Urgency Level"
            options={urgencyOptions}
            value={urgency}
            onChange={onUrgencyChange}
            placeholder="Select urgency"
            required
          />

          <Select
            label="Estimated Duration"
            options={durationOptions}
            value={estimatedDuration}
            onChange={onDurationChange}
            placeholder="Select duration"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsForm;