import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const DateTimeSelector = ({ 
  selectedDate, 
  onDateChange, 
  selectedTime, 
  onTimeChange,
  availableSlots 
}) => {
  const today = new Date()?.toISOString()?.split('T')?.[0];
  const maxDate = new Date();
  maxDate?.setDate(maxDate?.getDate() + 30);
  const maxDateStr = maxDate?.toISOString()?.split('T')?.[0];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const isSlotAvailable = (time) => {
    if (!selectedDate) return true;
    const slotKey = `${selectedDate}_${time}`;
    return availableSlots?.includes(slotKey);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Schedule Service</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Preferred Date"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e?.target?.value)}
            min={today}
            max={maxDateStr}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Preferred Time *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots?.map((time) => {
              const isAvailable = isSlotAvailable(time);
              const isSelected = selectedTime === time;
              
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => isAvailable && onTimeChange(time)}
                  disabled={!isAvailable}
                  className={`p-2 text-sm rounded-md border transition-micro ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : isAvailable
                      ? 'border-border hover:border-primary hover:bg-muted' :'border-border bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>{time}</span>
                    {!isAvailable && <Icon name="X" size={12} />}
                  </div>
                </button>
              );
            })}
          </div>
          {selectedDate && (
            <p className="text-xs text-muted-foreground mt-2">
              <Icon name="Info" size={12} className="inline mr-1" />
              Available slots for {new Date(selectedDate)?.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelector;