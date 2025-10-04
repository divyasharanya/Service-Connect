import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const UserContextIndicator = ({ 
  user = { name: 'John Doe', email: 'john@example.com', role: 'customer' },
  onLogout,
  onProfileClick,
  onSettingsClick 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'customer': return 'Customer';
      case 'admin': return 'Administrator';
      case 'technician': return 'Technician';
      default: return 'User';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'customer': return 'User';
      case 'admin': return 'Shield';
      case 'technician': return 'Wrench';
      default: return 'User';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'customer': return 'bg-primary text-primary-foreground';
      case 'admin': return 'bg-error text-error-foreground';
      case 'technician': return 'bg-accent text-accent-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleSettingsClick = () => {
    setIsMenuOpen(false);
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    return name?.split(' ')?.map(word => word?.charAt(0))?.join('')?.toUpperCase()?.slice(0, 2);
  };

  return (
    <div className="relative">
      {/* User Avatar/Button */}
      <Button
        variant="ghost"
        onClick={handleMenuToggle}
        className="flex items-center space-x-2 p-2 hover:bg-muted transition-micro"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
          {getInitials(user?.name)}
        </div>
        
        {/* User Info (Desktop) */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground truncate max-w-32">
            {user?.name}
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user?.role)}`}>
              {getRoleDisplayName(user?.role)}
            </span>
          </div>
        </div>
        
        <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
      </Button>
      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-floating z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {getInitials(user?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-popover-foreground truncate">
                  {user?.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Icon name={getRoleIcon(user?.role)} size={12} />
                  <span className="text-xs text-muted-foreground">
                    {getRoleDisplayName(user?.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
            >
              <Icon name="User" size={16} />
              <span>Profile</span>
            </button>
            
            <button
              onClick={handleSettingsClick}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
            >
              <Icon name="Settings" size={16} />
              <span>Settings</span>
            </button>

            {user?.role === 'customer' && (
              <>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
                >
                  <Icon name="CreditCard" size={16} />
                  <span>Payment Methods</span>
                </button>
                
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
                >
                  <Icon name="MapPin" size={16} />
                  <span>Addresses</span>
                </button>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
                >
                  <Icon name="BarChart3" size={16} />
                  <span>Analytics</span>
                </button>
                
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
                >
                  <Icon name="Shield" size={16} />
                  <span>System Admin</span>
                </button>
              </>
            )}

            <div className="border-t border-border my-2"></div>
            
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
            >
              <Icon name="HelpCircle" size={16} />
              <span>Help & Support</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-error hover:bg-muted transition-micro"
            >
              <Icon name="LogOut" size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContextIndicator;