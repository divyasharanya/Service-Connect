import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'customer', isAuthenticated = false, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Login', path: '/user-login', icon: 'LogIn' },
        { label: 'Register', path: '/user-registration', icon: 'UserPlus' }
      ];
    }

    switch (userRole) {
      case 'customer':
        return [
          { label: 'Dashboard', path: '/customer-dashboard', icon: 'Home' },
          { label: 'Book Service', path: '/service-booking-form', icon: 'Calendar' },
          { label: 'My Bookings', path: '/customer-booking-history', icon: 'Clock' },
          { label: 'Profile', path: '/customer-profile', icon: 'User' }
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin-dashboard', icon: 'BarChart3' },
          { label: 'Users', path: '/admin-users', icon: 'Users' },
          { label: 'Services', path: '/admin-services', icon: 'Settings' },
          { label: 'Reports', path: '/admin-reports', icon: 'FileText' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();
  const isCurrentPath = (path) => location?.pathname === path;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-subtle">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Wrench" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">ServiceConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.slice(0, 4)?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-micro ${
                isCurrentPath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
          
          {/* More Menu for additional items */}
          {navigationItems?.length > 4 && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMenuToggle}
                iconName="MoreHorizontal"
                iconSize={16}
              >
                More
              </Button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-elevated z-50">
                  {navigationItems?.slice(4)?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted transition-micro ${
                        isCurrentPath(item?.path) ? 'bg-muted text-primary' : 'text-popover-foreground'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          {isAuthenticated && (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="sm" iconName="Bell" iconSize={16} />
              
              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMenuToggle}
                  iconName="User"
                  iconSize={16}
                  className="hidden md:flex"
                />
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMenuToggle}
            iconName="Menu"
            iconSize={20}
            className="md:hidden"
          />
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-micro ${
                  isCurrentPath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}
            
            {isAuthenticated && (
              <div className="pt-2 mt-2 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-micro w-full"
                >
                  <Icon name="LogOut" size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;