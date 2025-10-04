import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthenticationLayout from '../../components/ui/AuthenticationLayout';
import LoginForm from './components/LoginForm';
import TrustIndicators from './components/TrustIndicators';
import MockCredentialsHelper from './components/MockCredentialsHelper';

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [autoFillCredentials, setAutoFillCredentials] = useState(null);
  const user = useSelector((s) => s.auth.user);
  const fromPath = location.state?.from;
  const infoMessage = location.state?.message;

  // Redirect authenticated users away from login
  useEffect(() => {
    if (!user) return;
    switch (user?.role) {
      case 'customer':
        navigate('/customer-dashboard', { replace: true });
        break;
      case 'admin':
        navigate('/admin-dashboard', { replace: true });
        break;
      case 'technician':
        navigate('/technician-dashboard', { replace: true });
        break;
      default:
        navigate('/customer-dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Load saved email if remember me was checked
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('savedEmail');
    
    if (rememberMe === 'true' && savedEmail) {
      setAutoFillCredentials({ email: savedEmail });
    }
  }, []);

  const handleCredentialSelect = (email, password) => {
    // This will be passed to LoginForm to auto-fill credentials
    setAutoFillCredentials({ email, password });
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticationLayout
        title="Welcome Back"
        subtitle="Sign in to your ServiceConnect account to access your dashboard and manage your services."
      >
        <div className="space-y-6">
          {/* Info banner if redirected from protected route or message present */}
          {(fromPath || infoMessage) && (
            <div className="p-3 rounded-md border border-blue-200 bg-blue-50 text-sm text-blue-800">
              {infoMessage || (
                <span>Login required to continue to <span className="font-medium">{fromPath}</span>.</span>
              )}
            </div>
          )}

          {/* Main Login Form */}
          <LoginForm autoFillCredentials={autoFillCredentials} />
          
          {/* Trust Indicators */}
          <TrustIndicators />
          
          {/* Demo Credentials Helper */}
          <MockCredentialsHelper onCredentialSelect={handleCredentialSelect} />
        </div>
      </AuthenticationLayout>
    </div>
  );
};

export default UserLogin;