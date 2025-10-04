import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import NotificationCenter from '../../components/ui/NotificationCenter';
import UserContextIndicator from '../../components/ui/UserContextIndicator';
import ServiceCategoryCard from './components/ServiceCategoryCard';
import RecentBookingCard from './components/RecentBookingCard';
import RecommendationCard from './components/RecommendationCard';
import QuickStatsCard from './components/QuickStatsCard';
import SearchBar from './components/SearchBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock user data
  const currentUser = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "customer"
  };

  // Mock service categories data
  const serviceCategories = [
    {
      id: "plumber",
      name: "Plumbing Services",
      type: "plumber",
      description: "Professional plumbing repairs, installations, and maintenance for your home water systems.",
      availableTechnicians: 24,
      rating: 4.8
    },
    {
      id: "carpenter",
      name: "Carpentry Services", 
      type: "carpenter",
      description: "Expert woodworking, furniture repair, and custom carpentry solutions for your home.",
      availableTechnicians: 18,
      rating: 4.7
    },
    {
      id: "electrician",
      name: "Electrical Services",
      type: "electrician", 
      description: "Licensed electrical work including wiring, repairs, and safety inspections.",
      availableTechnicians: 31,
      rating: 4.9
    }
  ];

  // Mock recent bookings data
  const recentBookings = [
    {
      id: "BK001",
      serviceName: "Kitchen Sink Repair",
      serviceType: "plumber",
      status: "confirmed",
      scheduledDate: "2025-01-07T14:00:00Z",
      technician: {
        name: "Mike Rodriguez",
        rating: 4.9
      },
      rated: false
    },
    {
      id: "BK002", 
      serviceName: "Cabinet Installation",
      serviceType: "carpenter",
      status: "in-progress",
      scheduledDate: "2025-01-06T10:00:00Z",
      technician: {
        name: "David Chen",
        rating: 4.8
      },
      rated: false
    },
    {
      id: "BK003",
      serviceName: "Outlet Installation",
      serviceType: "electrician",
      status: "completed",
      scheduledDate: "2025-01-04T16:00:00Z",
      technician: {
        name: "Lisa Thompson",
        rating: 5.0
      },
      rated: false
    }
  ];

  // Mock recommendations data
  const recommendations = [
    {
      id: "REC001",
      type: "seasonal",
      title: "Winter Heating Check",
      description: "Schedule your annual heating system maintenance before the cold season peaks.",
      category: "HVAC",
      serviceType: "electrician",
      discount: 15
    },
    {
      id: "REC002",
      type: "maintenance", 
      title: "Gutter Cleaning",
      description: "Prevent water damage with professional gutter cleaning and inspection services.",
      category: "Maintenance",
      serviceType: "carpenter",
      discount: null
    },
    {
      id: "REC003",
      type: "popular",
      title: "Bathroom Faucet Upgrade",
      description: "Most popular service this month - upgrade your bathroom fixtures with modern designs.",
      category: "Plumbing",
      serviceType: "plumber",
      discount: 20
    }
  ];

  // Mock quick stats data
  const quickStats = [
    {
      type: "total-bookings",
      label: "Total Bookings",
      value: "12",
      change: { type: "increase", value: "+2 this month" }
    },
    {
      type: "completed",
      label: "Completed",
      value: "9",
      change: { type: "increase", value: "+3 this week" }
    },
    {
      type: "pending",
      label: "Pending",
      value: "2",
      change: null
    },
    {
      type: "savings",
      label: "Total Savings",
      value: "$340",
      change: { type: "increase", value: "+$45 this month" }
    }
  ];

  const handleSearch = (query) => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      if (query?.trim()) {
        // Mock search results
        const mockResults = [
          { id: 1, name: "Emergency Plumber", type: "plumber", rating: 4.9 },
          { id: 2, name: "Kitchen Cabinet Repair", type: "carpenter", rating: 4.7 },
          { id: 3, name: "Electrical Inspection", type: "electrician", rating: 4.8 }
        ]?.filter(item => 
          item?.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
          item?.type?.toLowerCase()?.includes(query?.toLowerCase())
        );
        setSearchResults(mockResults);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 500);
  };

  const handleLogout = () => {
    navigate('/user-login');
  };

  const handleProfileClick = () => {
    console.log('Navigate to profile');
  };

  const handleSettingsClick = () => {
    console.log('Navigate to settings');
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        userRole="customer" 
        isAuthenticated={true} 
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
              Welcome back, {currentUser?.name?.split(' ')?.[0]}!
            </h1>
            <p className="text-muted-foreground">
              Find and book trusted home service professionals in your area.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <NotificationCenter 
              userRole="customer"
              isOpen={isNotificationOpen}
              onToggle={handleNotificationToggle}
            />
            <UserContextIndicator
              user={currentUser}
              onLogout={handleLogout}
              onProfileClick={handleProfileClick}
              onSettingsClick={handleSettingsClick}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            onFilterToggle={() => {}} 
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats?.map((stat, index) => (
            <QuickStatsCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Categories */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Service Categories
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  iconName="ArrowRight"
                  iconSize={16}
                >
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {serviceCategories?.map((service) => (
                  <ServiceCategoryCard key={service?.id} service={service} />
                ))}
              </div>
            </section>

            {/* Recent Bookings */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Recent Bookings
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/customer-booking-history')}
                  iconName="History"
                  iconSize={16}
                >
                  View History
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentBookings?.map((booking) => (
                  <RecentBookingCard key={booking?.id} booking={booking} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => navigate('/service-booking-form')}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Book New Service
                </Button>
                <Button 
                  variant="ghost" 
                  fullWidth
                  onClick={() => navigate('/customer-booking-history')}
                  iconName="Clock"
                  iconPosition="left"
                >
                  View Booking History
                </Button>
                <Button 
                  variant="ghost" 
                  fullWidth
                  iconName="Heart"
                  iconPosition="left"
                >
                  Saved Technicians
                </Button>
                <Button 
                  variant="ghost" 
                  fullWidth
                  iconName="Settings"
                  iconPosition="left"
                >
                  Account Settings
                </Button>
              </div>
            </section>

            {/* Recommendations */}
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Recommended for You
              </h3>
              <div className="space-y-4">
                {recommendations?.map((recommendation) => (
                  <RecommendationCard key={recommendation?.id} recommendation={recommendation} />
                ))}
              </div>
            </section>

            {/* Help & Support */}
            <section className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <Icon name="HelpCircle" size={16} />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Need Help?
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" fullWidth iconName="MessageCircle" iconPosition="left">
                  Live Chat
                </Button>
                <Button variant="ghost" size="sm" fullWidth iconName="Phone" iconPosition="left">
                  Call Support
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;