import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LocationForm = ({ 
  address, 
  onAddressChange, 
  instructions, 
  onInstructionsChange 
}) => {
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsUsingCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          // Mock reverse geocoding
          const mockAddress = "123 Main Street, Anytown, ST 12345";
          onAddressChange(mockAddress);
          setIsUsingCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsUsingCurrentLocation(false);
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Service Location</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              Service Address *
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUseCurrentLocation}
              loading={isUsingCurrentLocation}
              iconName="MapPin"
              iconPosition="left"
              iconSize={14}
            >
              Use Current Location
            </Button>
          </div>
          <Input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e?.target?.value)}
            placeholder="Enter your complete address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Special Instructions
          </label>
          <textarea
            value={instructions}
            onChange={(e) => onInstructionsChange(e?.target?.value)}
            placeholder="Any special instructions for the technician (e.g., gate code, parking instructions, specific entrance to use)..."
            className="w-full h-24 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Map Preview */}
        {address && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="h-48 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Icon name="MapPin" size={32} className="mx-auto mb-2" />
                <p className="text-sm">Map preview will appear here</p>
                <p className="text-xs">{address}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationForm;