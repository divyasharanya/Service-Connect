export const validateForm = (formData, selectedRole) => {
  const errors = {};

  // Common validations
  if (!formData?.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (formData?.fullName?.trim()?.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!formData?.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData?.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(formData?.phone?.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!formData?.password) {
    errors.password = 'Password is required';
  } else if (formData?.password?.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!formData?.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (formData?.password !== formData?.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!formData?.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms of service';
  }

  // Technician-specific validations
  if (selectedRole === 'technician') {
    if (!formData?.serviceCategories?.length) {
      errors.serviceCategories = 'Please select at least one service category';
    }

    if (!formData?.experienceLevel) {
      errors.experienceLevel = 'Please select your experience level';
    }

    if (!formData?.businessLicense?.trim()) {
      errors.businessLicense = 'Business license number is required';
    }

    if (!formData?.insurancePolicy?.trim()) {
      errors.insurancePolicy = 'Insurance policy number is required';
    }

    if (!formData?.serviceArea?.trim()) {
      errors.serviceArea = 'Please specify your service area';
    }

    if (!formData?.hourlyRate || formData?.hourlyRate < 10) {
      errors.hourlyRate = 'Please enter a valid hourly rate (minimum $10)';
    }

    if (!formData?.backgroundCheckConsent) {
      errors.backgroundCheckConsent = 'Background check consent is required';
    }
  }

  return errors;
};

export const validateField = (fieldName, value, formData, selectedRole) => {
  const errors = {};
  
  switch (fieldName) {
    case 'fullName':
      if (!value?.trim()) {
        errors.fullName = 'Full name is required';
      } else if (value?.trim()?.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
      }
      break;

    case 'email':
      if (!value?.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(value)) {
        errors.email = 'Please enter a valid email address';
      }
      break;

    case 'phone':
      if (!value?.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(value?.replace(/\s/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
      }
      break;

    case 'password':
      if (!value) {
        errors.password = 'Password is required';
      } else if (value?.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      break;

    case 'confirmPassword':
      if (!value) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData?.password !== value) {
        errors.confirmPassword = 'Passwords do not match';
      }
      break;

    case 'serviceCategories':
      if (selectedRole === 'technician' && (!value || value?.length === 0)) {
        errors.serviceCategories = 'Please select at least one service category';
      }
      break;

    case 'experienceLevel':
      if (selectedRole === 'technician' && !value) {
        errors.experienceLevel = 'Please select your experience level';
      }
      break;

    case 'businessLicense':
      if (selectedRole === 'technician' && !value?.trim()) {
        errors.businessLicense = 'Business license number is required';
      }
      break;

    case 'insurancePolicy':
      if (selectedRole === 'technician' && !value?.trim()) {
        errors.insurancePolicy = 'Insurance policy number is required';
      }
      break;

    case 'serviceArea':
      if (selectedRole === 'technician' && !value?.trim()) {
        errors.serviceArea = 'Please specify your service area';
      }
      break;

    case 'hourlyRate':
      if (selectedRole === 'technician' && (!value || value < 10)) {
        errors.hourlyRate = 'Please enter a valid hourly rate (minimum $10)';
      }
      break;

    default:
      break;
  }

  return errors;
};