import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/ui/Header';
import NotificationCenter from '../../components/ui/NotificationCenter';
import UserContextIndicator from '../../components/ui/UserContextIndicator';
import RecentBookingCard from './components/RecentBookingCard';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { getBookings } from '../../utils/api';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const [bookings, setBookingsState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [techList, setTechList] = useState([]);

  useEffect(() => {
    if (!user?.id) {
      setBookingsState([]);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getBookings({ customerId: user.id });
        setBookingsState(data || []);
      } catch (e) {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { getTechnicians } = await import('../../utils/api');
        const data = await getTechnicians({ status: 'verified' });
        if (mounted) setTechList(data || []);
      } catch {
        setTechList([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Transform API bookings to UI-friendly shape for RecentBookingCard
  const uiBookings = bookings.map(b => ({
    id: b.id,
    serviceName: b.serviceName,
    serviceType: (b.serviceName || '').toLowerCase(),
    status: b.status === 'accepted' ? 'confirmed' : b.status === 'rejected' ? 'cancelled' : b.status,
    scheduledDate: b.date,
    technician: { name: b.technicianName || 'Unassigned', rating: b.rating || undefined },
    rated: !!b.rating,
    totalCost: typeof b.totalCost !== 'undefined' ? (b.totalCost.toFixed ? b.totalCost.toFixed(2) : String(b.totalCost)) : undefined,
  }));

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
        isAuthenticated={!!user} 
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
              {user ? `Welcome back, ${user?.name?.split(' ')?.[0]}!` : 'Welcome to ServiceConnect'}
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
            {user && (
              <UserContextIndicator
                user={{ name: user.name, email: user.email, role: 'customer' }}
                onLogout={handleLogout}
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Message / Recent Bookings */}
            {!user && (
              <div className="rounded-md border bg-white p-6 text-slate-700">
                No reports available. Please log in and book a slot.
                <div className="mt-4">
                  <Button variant="default" onClick={() => navigate('/user-login')} iconName="LogIn" iconPosition="left">Login</Button>
                </div>
              </div>
            )}

            {user && (
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
                {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
                {error && <p className="text-sm text-error">{error}</p>}
                {!loading && uiBookings.length === 0 && (
                  <div className="rounded-md border bg-white p-4 text-slate-600">
                    No reports available. Please log in and book a slot.
                  </div>
                )}
                {!loading && uiBookings.length > 0 && (
                  <div className="space-y-4">
                    {uiBookings.map((booking) => (
                      <RecentBookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Available Technicians */}
            {user && (
              <section>
                <h3 className="text-lg font-semibold text-foreground mb-4">Available Technicians</h3>
                <div className="space-y-2">
                  {techList.length === 0 && (
                    <div className="rounded-md border bg-white p-3 text-sm text-slate-600">No technicians available yet.</div>
                  )}
                  {techList.map(t => (
                    <div key={t.id} className="flex items-center justify-between rounded-md border bg-white p-3 text-sm">
                      <div>
                        <div className="font-medium text-foreground">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.service}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">⭐ {t.rating?.toFixed ? t.rating.toFixed(1) : t.rating}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

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