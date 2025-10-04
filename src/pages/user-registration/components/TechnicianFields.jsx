import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const TechnicianFields = ({ formData, errors, onChange, onCheckboxChange }) => {
  const serviceCategories = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'painting', label: 'Painting' },
    { value: 'cleaning', label: 'Cleaning' }
  ];

  const experienceLevels = [
    { value: '1-2', label: '1-2 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '6-10', label: '6-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  return (
    <div className="space-y-6">
      {/* Service Categories */}
      <div>
        <Select
          label="Service Categories"
          description="Select the services you can provide"
          options={serviceCategories}
          value={formData?.serviceCategories || []}
          onChange={(value) => onChange('serviceCategories', value)}
          error={errors?.serviceCategories}
          multiple
          searchable
          required
          placeholder="Choose your service categories"
        />
      </div>
      {/* Experience Level */}
      <div>
        <Select
          label="Experience Level"
          options={experienceLevels}
          value={formData?.experienceLevel || ''}
          onChange={(value) => onChange('experienceLevel', value)}
          error={errors?.experienceLevel}
          required
          placeholder="Select your experience level"
        />
      </div>
      {/* Business License */}
      <div>
        <Input
          label="Business License Number"
          type="text"
          placeholder="Enter your business license number"
          value={formData?.businessLicense || ''}
          onChange={(e) => onChange('businessLicense', e?.target?.value)}
          error={errors?.businessLicense}
          description="Required for verification purposes"
        />
      </div>
      {/* Insurance Information */}
      <div>
        <Input
          label="Insurance Policy Number"
          type="text"
          placeholder="Enter your insurance policy number"
          value={formData?.insurancePolicy || ''}
          onChange={(e) => onChange('insurancePolicy', e?.target?.value)}
          error={errors?.insurancePolicy}
          description="Liability insurance is required"
        />
      </div>
      {/* Service Area */}
      <div>
        <Input
          label="Service Area (ZIP Codes)"
          type="text"
          placeholder="e.g., 10001, 10002, 10003"
          value={formData?.serviceArea || ''}
          onChange={(e) => onChange('serviceArea', e?.target?.value)}
          error={errors?.serviceArea}
          description="Enter ZIP codes you can service, separated by commas"
        />
      </div>
      {/* Hourly Rate */}
      <div>
        <Input
          label="Hourly Rate (USD)"
          type="number"
          placeholder="50"
          value={formData?.hourlyRate || ''}
          onChange={(e) => onChange('hourlyRate', e?.target?.value)}
          error={errors?.hourlyRate}
          min="10"
          max="500"
          description="Your standard hourly rate"
        />
      </div>
      {/* Certifications */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Certifications & Qualifications
        </label>
        <div className="space-y-2">
          <Checkbox
            label="EPA Certified (for HVAC)"
            checked={formData?.certifications?.epa || false}
            onChange={(e) => onCheckboxChange('certifications.epa', e?.target?.checked)}
          />
          <Checkbox
            label="Licensed Electrician"
            checked={formData?.certifications?.electrician || false}
            onChange={(e) => onCheckboxChange('certifications.electrician', e?.target?.checked)}
          />
          <Checkbox
            label="Master Plumber License"
            checked={formData?.certifications?.plumber || false}
            onChange={(e) => onCheckboxChange('certifications.plumber', e?.target?.checked)}
          />
          <Checkbox
            label="OSHA Safety Certified"
            checked={formData?.certifications?.osha || false}
            onChange={(e) => onCheckboxChange('certifications.osha', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Background Check Consent */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <Checkbox
          label="I consent to background check verification"
          description="Required for platform approval and customer trust"
          checked={formData?.backgroundCheckConsent || false}
          onChange={(e) => onCheckboxChange('backgroundCheckConsent', e?.target?.checked)}
          error={errors?.backgroundCheckConsent}
          required
        />
      </div>
    </div>
  );
};

export default TechnicianFields;