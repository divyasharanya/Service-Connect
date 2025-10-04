import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationLayout from '../../components/ui/AuthenticationLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';
import RoleSelectionCard from './components/RoleSelectionCard';
import PasswordStrengthIndicator from './components/PasswordStrengthIndicator';
import TechnicianFields from './components/TechnicianFields';
import { validateForm, validateField } from './components/FormValidation';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    // Technician specific fields
    serviceCategories: [],
    experienceLevel: '',
    businessLicense: '',
    insurancePolicy: '',
    serviceArea: '',
    hourlyRate: '',
    certifications: {
      epa: false,
      electrician: false,
      plumber: false,
      osha: false
    },
    backgroundCheckConsent: false
  });

  const roleData = {
    customer: {
      title: 'Customer',
      description: 'Book trusted home service professionals for your needs',
      features: [
        'Browse verified service providers',
        'Schedule appointments online',
        'Track service progress',
        'Rate and review services',
        'Secure payment processing'
      ]
    },
    technician: {
      title: 'Service Technician',
      description: 'Join our network of professional service providers',
      features: [
        'Receive job requests in your area',
        'Set your own rates and schedule',
        'Build your customer base',
        'Get paid securely and on time',
        'Access business tools and support'
      ]
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCheckboxChange = (field, checked) => {
    if (field?.includes('.')) {
      const [parent, child] = field?.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev?.[parent],
          [child]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: checked
      }));
    }

    // Clear field error
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFieldBlur = (fieldName) => {
    const fieldErrors = validateField(fieldName, formData?.[fieldName], formData, selectedRole);
    setErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const formErrors = validateForm(formData, selectedRole);
    
    if (Object.keys(formErrors)?.length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      console.log('Registration successful:', { ...formData, role: selectedRole });
      
      // Navigate based on role
      if (selectedRole === 'customer') {
        navigate('/customer-dashboard');
      } else {
        // For technicians, they would typically go through verification first
        navigate('/user-login', { 
          state: { 
            message: 'Registration successful! Please check your email for verification instructions.' 
          }
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthenticationLayout
      title="Create Your Account"
      subtitle="Join ServiceConnect and start booking trusted home services"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Choose Your Account Type
            </h3>
            <p className="text-sm text-muted-foreground">
              Select how you'll be using ServiceConnect
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(roleData)?.map(([role, data]) => (
              <RoleSelectionCard
                key={role}
                role={role}
                title={data?.title}
                description={data?.description}
                features={data?.features}
                isSelected={selectedRole === role}
                onSelect={setSelectedRole}
              />
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">
            Basic Information
          </h4>
          
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            onBlur={() => handleFieldBlur('fullName')}
            error={errors?.fullName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            onBlur={() => handleFieldBlur('email')}
            error={errors?.email}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            onBlur={() => handleFieldBlur('phone')}
            error={errors?.phone}
            required
          />

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={formData?.password}
              onChange={(e) => handleInputChange('password', e?.target?.value)}
              onBlur={() => handleFieldBlur('password')}
              error={errors?.password}
              required
            />
            <PasswordStrengthIndicator password={formData?.password} />
          </div>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData?.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
            onBlur={() => handleFieldBlur('confirmPassword')}
            error={errors?.confirmPassword}
            required
          />
        </div>

        {/* Technician-specific fields */}
        {selectedRole === 'technician' && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground">
              Professional Information
            </h4>
            <TechnicianFields
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onCheckboxChange={handleCheckboxChange}
            />
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <Checkbox
            label={
              <span className="text-sm">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            }
            checked={formData?.agreeToTerms}
            onChange={(e) => handleCheckboxChange('agreeToTerms', e?.target?.checked)}
            error={errors?.agreeToTerms}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="space-y-4">
          {errors?.submit && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <span className="text-sm text-error">{errors?.submit}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            iconName="UserPlus"
            iconPosition="left"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/user-login"
              className="font-medium text-primary hover:text-primary/80 transition-micro"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </AuthenticationLayout>
  );
};

export default UserRegistration;