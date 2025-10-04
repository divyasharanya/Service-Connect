import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import BookingCard from './components/BookingCard';
import BookingTable from './components/BookingTable';
import BookingFilters from './components/BookingFilters';
import BookingDetailsModal from './components/BookingDetailsModal';
import RatingModal from './components/RatingModal';
import RescheduleModal from './components/RescheduleModal';
import { getBookings, updateBookingStatus, updateBooking } from '../../utils/api';
import { useDispatch } from 'react-redux';
import { showError, showSuccess } from '../../features/notifications/notificationsSlice';

const CustomerBookingHistory = () => {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const notify = useDispatch();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [bookingToRate, setBookingToRate] = useState(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleBooking, setRescheduleBooking] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Real booking data fetched for logged-in customer
  const [allBookings, setAllBookings] = useState([]);

  const loadBookings = async () => {
    if (!user?.id) { setAllBookings([]); return; }
    setLoading(true);
    setError('');
    try {
      const data = await getBookings({ customerId: user.id });
      const mapped = (data || []).map(b => ({
        id: b.id,
        serviceType: (b.serviceName || '').toLowerCase(),
        technicianName: b.technicianName || 'Unassigned',
        technicianPhone: '',
        date: new Date(b.date).toISOString().slice(0,10),
        time: new Date(b.date).toISOString().slice(11,16),
        address: b.location || '',
        description: b.review || '',
        status: b.status === 'accepted' ? 'confirmed' : b.status,
        totalCost: (typeof b.totalCost !== 'undefined') ? (b.totalCost.toFixed ? b.totalCost.toFixed(2) : String(b.totalCost)) : '0.00',
        serviceFee: (typeof b.serviceFee !== 'undefined') ? (b.serviceFee.toFixed ? b.serviceFee.toFixed(2) : String(b.serviceFee)) : '0.00',
        platformFee: (typeof b.platformFee !== 'undefined') ? (b.platformFee.toFixed ? b.platformFee.toFixed(2) : String(b.platformFee)) : '0.00',
        duration: '',
        rating: b.rating || null,
        customerRating: b.rating || null,
        customerReview: b.review || null,
        completionNotes: '',
        rated: !!b.rating,
      }));
      setAllBookings(mapped);
    } catch (e) {
      setError('Failed to load bookings.');
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user?.id]);

  const handleCancel = async (booking) => {
    try {
      await updateBookingStatus(booking.id, 'cancelled');
      notify(showSuccess('Booking cancelled'));
      loadBookings();
    } catch (e) {
      notify(showError('Failed to cancel booking'));
    }
  };

  const handleReschedule = (booking) => {
    setRescheduleBooking(booking);
    setRescheduleOpen(true);
  };

  const submitReschedule = async (iso) => {
    try {
      await updateBooking(rescheduleBooking.id, { date: iso });
      notify(showSuccess('Booking rescheduled'));
      setRescheduleOpen(false);
      setRescheduleBooking(null);
      loadBookings();
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to reschedule booking';
      notify(showError(msg));
    }
  };

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    serviceType: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    minRating: '',
    sortBy: 'date-desc'
  });

  // Filtered and sorted bookings
  const [filteredBookings, setFilteredBookings] = useState([]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...allBookings];

    // Search filter
    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(booking =>
        booking?.technicianName?.toLowerCase()?.includes(searchLower) ||
        booking?.serviceType?.toLowerCase()?.includes(searchLower) ||
        booking?.description?.toLowerCase()?.includes(searchLower)
      );
    }

    // Service type filter
    if (filters?.serviceType) {
      filtered = filtered?.filter(booking =>
        booking?.serviceType?.toLowerCase() === filters?.serviceType?.toLowerCase()
      );
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(booking =>
        booking?.status?.toLowerCase() === filters?.status?.toLowerCase()
      );
    }

    // Date range filter
    if (filters?.dateFrom) {
      filtered = filtered?.filter(booking =>
        new Date(booking.date) >= new Date(filters.dateFrom)
      );
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter(booking =>
        new Date(booking.date) <= new Date(filters.dateTo)
      );
    }

    // Rating filter
    if (filters?.minRating) {
      const minRating = parseFloat(filters?.minRating);
      filtered = filtered?.filter(booking =>
        booking?.rating && booking?.rating >= minRating
      );
    }

    // Sorting
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'cost-asc':
          return parseFloat(a?.totalCost) - parseFloat(b?.totalCost);
        case 'cost-desc':
          return parseFloat(b?.totalCost) - parseFloat(a?.totalCost);
        case 'rating-desc':
          return (b?.rating || 0) - (a?.rating || 0);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredBookings(filtered);
  }, [filters, allBookings]);

  // Event handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      serviceType: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      minRating: '',
      sortBy: 'date-desc'
    });
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleRebook = (booking) => {
    // Navigate to booking form with pre-filled data
    navigate('/service-booking-form', {
      state: {
        serviceType: booking?.serviceType,
        address: booking?.address,
        description: booking?.description
      }
    });
  };

  const handleRate = (booking) => {
    setBookingToRate(booking);
    setIsRatingModalOpen(true);
  };

  const handleContact = (booking) => {
    // In a real app, this would open a chat or call interface
    alert(`Contacting ${booking?.technicianName} at ${booking?.technicianPhone}`);
  };

  const handleSubmitRating = (ratingData) => {
    // In a real app, this would submit to the backend
    console.log('Rating submitted:', ratingData);
    alert('Thank you for your rating!');
  };

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/PDF
    const csvContent = filteredBookings?.map(booking => 
      `${booking?.id},${booking?.serviceType},${booking?.technicianName},${booking?.date},${booking?.status},${booking?.totalCost}`
    )?.join('\n');
    
    const blob = new Blob([`ID,Service,Technician,Date,Status,Cost\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'booking-history.csv';
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const getStatusCounts = () => {
    return {
      total: allBookings?.length,
      completed: allBookings?.filter(b => b?.status === 'completed')?.length,
      pending: allBookings?.filter(b => b?.status === 'pending')?.length,
      confirmed: allBookings?.filter(b => b?.status === 'confirmed')?.length,
      inProgress: allBookings?.filter(b => b?.status === 'in-progress')?.length,
      cancelled: allBookings?.filter(b => b?.status === 'cancelled')?.length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="customer" 
        isAuthenticated={!!user}
        onLogout={() => navigate('/user-login')}
      />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Booking History</h1>
            <p className="text-muted-foreground">
              Track and manage all your service bookings
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Link to="/service-booking-form">
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                New Booking
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{statusCounts?.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success">{statusCounts?.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{statusCounts?.confirmed}</div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-warning">{statusCounts?.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{statusCounts?.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-error">{statusCounts?.cancelled}</div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <BookingFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onExport={handleExport}
            isFilterOpen={isFilterOpen}
            onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {loading ? 'Loading bookings...' : `Showing ${filteredBookings?.length} of ${allBookings?.length} bookings`}
            </span>
            {error && <span className="text-sm text-error ml-3">{error}</span>}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              iconName="Table"
              iconSize={16}
              className="hidden md:flex"
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
              iconName="Grid3X3"
              iconSize={16}
            >
              Cards
            </Button>
          </div>
        </div>

        {/* Bookings Display */}
        {filteredBookings?.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6">
              {filters?.search || filters?.serviceType || filters?.status 
                ? "Try adjusting your filters to see more results." :"You haven't made any service bookings yet."
              }
            </p>
            <Link to="/service-booking-form">
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Book Your First Service
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            {viewMode === 'table' && (
              <div className="hidden md:block">
                <BookingTable
                  bookings={filteredBookings}
                  onViewDetails={handleViewDetails}
                  onRebook={handleRebook}
                  onRate={handleRate}
                  onContact={handleContact}
                  onCancel={handleCancel}
                  onReschedule={handleReschedule}
                />
              </div>
            )}

            {/* Mobile/Card View */}
            {(viewMode === 'cards' || viewMode === 'table') && (
              <div className={`${viewMode === 'table' ? 'md:hidden' : ''} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                {filteredBookings?.map((booking) => (
                  <BookingCard
                    key={booking?.id}
                    booking={booking}
                    onViewDetails={handleViewDetails}
                    onRebook={handleRebook}
                    onRate={handleRate}
                    onContact={handleContact}
                    onCancel={handleCancel}
                    onReschedule={handleReschedule}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Load More Button (if needed for pagination) */}
        {filteredBookings?.length > 0 && filteredBookings?.length < allBookings?.length && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Bookings
            </Button>
          </div>
        )}
      </main>
      {/* Modals */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        onRebook={handleRebook}
        onRate={handleRate}
        onContact={handleContact}
      />
      <RatingModal
        booking={bookingToRate}
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setBookingToRate(null);
        }}
        onSubmitRating={handleSubmitRating}
      />
      <RescheduleModal
        booking={rescheduleBooking}
        isOpen={rescheduleOpen}
        onClose={() => { setRescheduleOpen(false); setRescheduleBooking(null); }}
        onSubmit={submitReschedule}
      />
    </div>
  );
};

export default CustomerBookingHistory;