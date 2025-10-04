import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const AuthenticationLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple Header */}
      <header className="w-full bg-card border-b border-border">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Wrench" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">ServiceConnect</span>
          </Link>

          {/* Simple Navigation */}
          <nav className="flex items-center space-x-4">
            <Link
              to="/user-login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-micro"
            >
              Sign In
            </Link>
            <Link
              to="/user-registration"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-micro"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header Text */}
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && (
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-card border border-border rounded-lg shadow-subtle p-6">
            {children}
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <Link
                to="/help"
                className="font-medium text-primary hover:text-primary/80 transition-micro"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-border bg-card">
        <div className="px-4 py-6 lg:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-primary rounded">
                <Icon name="Wrench" size={14} color="white" />
              </div>
              <span className="text-sm font-medium text-foreground">ServiceConnect</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-micro">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-micro">
                Terms of Service
              </Link>
              <span>© 2025 ServiceConnect</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthenticationLayout;