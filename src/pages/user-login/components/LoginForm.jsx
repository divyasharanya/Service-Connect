import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, setAuthStatus, setAuthError } from 'features/auth/authSlice';
import { showSuccess, showError } from 'features/notifications/notificationsSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { login as apiLogin } from 'utils/api';

const LoginForm = ({ autoFillCredentials }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: autoFillCredentials?.email || '',
    password: autoFillCredentials?.password || '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Mock credentials for different user roles
  const mockCredentials = {
    customer: { email: 'customer@serviceconnect.com', password: 'customer123' },
    admin: { email: 'admin@serviceconnect.com', password: 'admin123' },
    technician: { email: 'technician@serviceconnect.com', password: 'tech123' }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error when user modifies credentials
    if (authError && (name === 'email' || name === 'password')) {
      setAuthError('');
    }
  };

  const authenticateUser = (email, password) => {
    // Check against mock credentials
    for (const [role, credentials] of Object.entries(mockCredentials)) {
      if (credentials?.email === email && credentials?.password === password) {
        return { success: true, role, user: { email, role } };
      }
    }
    return { success: false, message: 'Invalid email or password. Please check your credentials and try again.' };
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthError('');
    dispatch(setAuthStatus('loading'));

    try {
      // Use API with mock/real toggle
      const result = await apiLogin({ email: formData.email, password: formData.password });
      const userRole = result?.user?.role ?? authenticateUser(formData?.email, formData?.password)?.role ?? 'customer';
      const user = { ...result.user, role: userRole };

      // Store in Redux and localStorage for backward compatibility
      dispatch(loginSuccess({ user, token: result.token }));
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Show success toast
      dispatch(showSuccess(`Welcome back, ${user.name}!`));

      if (formData?.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedEmail', formData?.email);
      }

      // Navigate by role or back to the "from" page if present
      const from = location.state?.from;
      if (from && from !== '/user-login') {
        navigate(from, { replace: true });
        return;
      }

      switch (userRole) {
        case 'customer':
          navigate('/customer-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'technician':
          navigate('/technician-dashboard');
          break;
        default:
          navigate('/customer-dashboard');
      }
    } catch (error) {
      const message = 'An error occurred during login. Please try again.';
      setAuthError(message);
      dispatch(setAuthError(message));
      dispatch(showError(message));
    } finally {
      setIsLoading(false);
      dispatch(setAuthStatus('idle'));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Authentication Error */}
      {authError && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
            <p className="text-sm text-error">{authError}</p>
          </div>
        </div>
      )}
      {/* Email Field */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData?.email}
        onChange={handleInputChange}
        placeholder="Enter your email address"
        error={errors?.email}
        required
        disabled={isLoading}
        className="w-full"
      />
      {/* Password Field */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData?.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          error={errors?.password}
          required
          disabled={isLoading}
          className="w-full pr-12"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
          disabled={isLoading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
        </button>
      </div>
      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-micro"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        iconName="LogIn"
        iconPosition="left"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
      {/* Registration Link */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          New to ServiceConnect?{' '}
          <button
            type="button"
            onClick={() => navigate('/user-registration')}
            className="font-medium text-primary hover:text-primary/80 transition-micro"
            disabled={isLoading}
          >
            Create an account
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;