import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = () => {
  const quickActions = [
    {
      id: 1,
      title: 'User Management',
      description: 'Manage customer and technician accounts',
      icon: 'Users',
      color: 'primary',
      path: '/admin-users',
      actions: [
        { label: 'View All Users', icon: 'Eye' },
        { label: 'Add New User', icon: 'UserPlus' },
        { label: 'Pending Approvals', icon: 'Clock', badge: '5' }
      ]
    },
    {
      id: 2,
      title: 'Service Management',
      description: 'Configure services and pricing',
      icon: 'Settings',
      color: 'accent',
      path: '/admin-services',
      actions: [
        { label: 'Service Categories', icon: 'Grid3x3' },
        { label: 'Pricing Rules', icon: 'DollarSign' },
        { label: 'Service Areas', icon: 'MapPin' }
      ]
    },
    {
      id: 3,
      title: 'Booking Oversight',
      description: 'Monitor and manage all bookings',
      icon: 'Calendar',
      color: 'warning',
      path: '/admin-bookings',
      actions: [
        { label: 'Active Bookings', icon: 'Clock', badge: '12' },
        { label: 'Disputes', icon: 'AlertTriangle', badge: '2' },
        { label: 'Cancellations', icon: 'X' }
      ]
    },
    {
      id: 4,
      title: 'Financial Reports',
      description: 'Revenue and payment analytics',
      icon: 'BarChart3',
      color: 'success',
      path: '/admin-reports',
      actions: [
        { label: 'Revenue Report', icon: 'TrendingUp' },
        { label: 'Payment Issues', icon: 'CreditCard' },
        { label: 'Export Data', icon: 'Download' }
      ]
    },
    {
      id: 5,
      title: 'Platform Settings',
      description: 'System configuration and settings',
      icon: 'Cog',
      color: 'secondary',
      path: '/admin-settings',
      actions: [
        { label: 'General Settings', icon: 'Settings' },
        { label: 'Notifications', icon: 'Bell' },
        { label: 'Security', icon: 'Shield' }
      ]
    },
    {
      id: 6,
      title: 'Support Center',
      description: 'Customer support and help desk',
      icon: 'MessageSquare',
      color: 'primary',
      path: '/admin-support',
      actions: [
        { label: 'Open Tickets', icon: 'MessageSquare', badge: '8' },
        { label: 'FAQ Management', icon: 'HelpCircle' },
        { label: 'Live Chat', icon: 'MessageCircle' }
      ]
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary text-primary-foreground';
      case 'accent':
        return 'bg-accent text-accent-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'success':
        return 'bg-success text-success-foreground';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Access frequently used management tools
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions?.map((action) => (
            <div key={action?.id} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-micro">
              <div className="flex items-start space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(action?.color)}`}>
                  <Icon name={action?.icon} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {action?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {action?.description}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {action?.actions?.map((subAction, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between w-full p-2 text-sm text-foreground hover:bg-muted rounded-md transition-micro"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name={subAction?.icon} size={14} className="text-muted-foreground" />
                      <span>{subAction?.label}</span>
                    </div>
                    {subAction?.badge && (
                      <span className="text-xs px-2 py-1 bg-error text-error-foreground rounded-full">
                        {subAction?.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-border">
                <Link to={action?.path}>
                  <Button variant="outline" size="sm" fullWidth>
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Emergency Actions */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Emergency Actions</h4>
          <div className="flex flex-wrap gap-3">
            <Button variant="destructive" size="sm" iconName="AlertTriangle" iconPosition="left">
              System Maintenance
            </Button>
            <Button variant="outline" size="sm" iconName="Shield" iconPosition="left">
              Security Alert
            </Button>
            <Button variant="outline" size="sm" iconName="Database" iconPosition="left">
              Backup System
            </Button>
            <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
              Restart Services
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;