import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import Header from '../../components/ui/Header';
import NotificationCenter from '../../components/ui/NotificationCenter';
import UserContextIndicator from '../../components/ui/UserContextIndicator';

// Import all components
import MetricsCard from './components/MetricsCard';
import PendingActionsPanel from './components/PendingActionsPanel';
import UserManagementSection from './components/UserManagementSection';
import BookingMonitoringPanel from './components/BookingMonitoringPanel';
import AnalyticsSection from './components/AnalyticsSection';
import SystemHealthMonitor from './components/SystemHealthMonitor';
import QuickActionsPanel from './components/QuickActionsPanel';

const AdminDashboard = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin user data
  const adminUser = {
    name: 'Admin User',
    email: 'admin@serviceconnect.com',
    role: 'admin'
  };

  // Derived metrics from store data
  // Using rough estimates from mock data and service price baselines
  // Selectors are implemented in selectors/adminStats
  const { totalRevenue, activeCount, completedCount } = require('../../selectors/adminStats').computeAdminStats();

  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: '+0.0%',
      changeType: 'neutral',
      icon: 'DollarSign',
      color: 'success'
    },
    {
      title: 'Active Bookings',
      value: `${activeCount}`,
      change: '+0',
      changeType: 'neutral',
      icon: 'Calendar',
      color: 'primary'
    },
    {
      title: 'Completed (All Time)',
      value: `${completedCount}`,
      change: '+0',
      changeType: 'neutral',
      icon: 'CheckCircle2',
      color: 'accent'
    },
    {
      title: 'Platform Utilization',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'warning'
    }
  ];

  const handleLogout = () => {
    // Handle logout logic
    console.log('Admin logout');
  };

  const handleProfileClick = () => {
    // Handle profile navigation
    console.log('Navigate to admin profile');
  };

  const handleSettingsClick = () => {
    // Handle settings navigation
    console.log('Navigate to admin settings');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'bookings', label: 'Bookings', icon: 'Calendar' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'system', label: 'System', icon: 'Settings' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMetrics?.map((metric, index) => (
                <MetricsCard key={index} {...metric} />
              ))}
            </div>
            {/* Main Dashboard Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PendingActionsPanel />
              <QuickActionsPanel />
            </div>
          </div>
        );
      
      case 'users':
        return <UserManagementSection />;
      
      case 'bookings':
        return <BookingMonitoringPanel />;
      
      case 'analytics':
        return <AnalyticsSection />;
      
      case 'system':
        return <SystemHealthMonitor />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        userRole="admin" 
        isAuthenticated={true} 
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <div className="bg-card border-b border-border">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive platform management and analytics
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <NotificationCenter
                  userRole="admin"
                  isOpen={isNotificationOpen}
                  onToggle={() => setIsNotificationOpen(!isNotificationOpen)}
                />
                
                {/* User Context */}
                <UserContextIndicator
                  user={adminUser}
                  onLogout={handleLogout}
                  onProfileClick={handleProfileClick}
                  onSettingsClick={handleSettingsClick}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card border-b border-border">
          <div className="px-4 lg:px-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-micro ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="px-4 lg:px-6 py-6">
          {renderTabContent()}
        </div>

        {/* Quick Navigation Footer */}
        <div className="bg-card border-t border-border mt-8">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link 
                to="/user-registration" 
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-micro"
              >
                <Icon name="UserPlus" size={14} />
                <span>User Registration</span>
              </Link>
              <Link 
                to="/user-login" 
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-micro"
              >
                <Icon name="LogIn" size={14} />
                <span>User Login</span>
              </Link>
              <Link 
                to="/customer-dashboard" 
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-micro"
              >
                <Icon name="Home" size={14} />
                <span>Customer Dashboard</span>
              </Link>
              <Link 
                to="/service-booking-form" 
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-micro"
              >
                <Icon name="Calendar" size={14} />
                <span>Service Booking</span>
              </Link>
              <Link 
                to="/customer-booking-history" 
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-micro"
              >
                <Icon name="Clock" size={14} />
                <span>Booking History</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="px-4 lg:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-primary rounded">
                <Icon name="Wrench" size={14} color="white" />
              </div>
              <span className="text-sm font-medium text-foreground">ServiceConnect Admin</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>System Status: Operational</span>
              <span>Last Updated: {new Date()?.toLocaleTimeString()}</span>
              <span>© {new Date()?.getFullYear()} ServiceConnect</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;