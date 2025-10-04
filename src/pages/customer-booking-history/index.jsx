import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import BookingCard from './components/BookingCard';
import BookingTable from './components/BookingTable';
import BookingFilters from './components/BookingFilters';
import BookingDetailsModal from './components/BookingDetailsModal';
import RatingModal from './components/RatingModal';

const CustomerBookingHistory = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [bookingToRate, setBookingToRate] = useState(null);

  // Mock booking data
  const [allBookings] = useState([
    {
      id: "BK001",
      serviceType: "Plumbing",
      technicianName: "Michael Rodriguez",
      technicianPhone: "+1 (555) 123-4567",
      date: "2025-01-05",
      time: "14:00",
      address: "123 Oak Street, Springfield, IL 62701",
      description: "Kitchen sink repair - fixing leaky faucet and replacing worn gaskets. Customer reported constant dripping and low water pressure.",
      status: "completed",
      totalCost: "125.00",
      serviceFee: "112.50",
      platformFee: "12.50",
      duration: "2 hours",
      rating: 4.8,
      customerRating: 5,
      customerReview: "Excellent service! Michael was professional and fixed the issue quickly.",
      completionNotes: "Replaced faucet gaskets and cleaned aerator. Tested for leaks - all working properly.",
      rated: true
    },
    {
      id: "BK002",
      serviceType: "Electrical",
      technicianName: "Sarah Johnson",
      technicianPhone: "+1 (555) 234-5678",
      date: "2025-01-03",
      time: "10:30",
      address: "456 Pine Avenue, Springfield, IL 62702",
      description: "Ceiling fan installation in master bedroom. Customer provided the fan unit.",
      status: "completed",
      totalCost: "95.00",
      serviceFee: "85.50",
      platformFee: "9.50",
      duration: "1.5 hours",
      rating: 4.9,
      customerRating: null,
      customerReview: null,
      completionNotes: "Successfully installed ceiling fan with wall switch. Tested all speeds and lighting.",
      rated: false
    },
    {
      id: "BK003",
      serviceType: "HVAC",
      technicianName: "David Chen",
      technicianPhone: "+1 (555) 345-6789",
      date: "2025-01-08",
      time: "09:00",
      address: "789 Maple Drive, Springfield, IL 62703",
      description: "Annual HVAC maintenance and filter replacement. System inspection and cleaning.",
      status: "confirmed",
      totalCost: "150.00",
      serviceFee: "135.00",
      platformFee: "15.00",
      duration: "2.5 hours",
      rating: 4.7,
      customerRating: null,
      customerReview: null,
      completionNotes: null,
      rated: false
    },
    {
      id: "BK004",
      serviceType: "Carpentry",
      technicianName: "James Wilson",
      technicianPhone: "+1 (555) 456-7890",
      date: "2025-01-10",
      time: "13:00",
      address: "321 Elm Street, Springfield, IL 62704",
      description: "Custom bookshelf installation in home office. Mounting to wall studs required.",
      status: "in-progress",
      totalCost: "200.00",
      serviceFee: "180.00",
      platformFee: "20.00",
      duration: "3 hours",
      rating: 4.6,
      customerRating: null,
      customerReview: null,
      completionNotes: null,
      rated: false
    },
    {
      id: "BK005",
      serviceType: "Painting",
      technicianName: "Lisa Thompson",
      technicianPhone: "+1 (555) 567-8901",
      date: "2024-12-28",
      time: "08:00",
      address: "654 Cedar Lane, Springfield, IL 62705",
      description: "Living room accent wall painting. Customer provided paint and materials.",
      status: "completed",
      totalCost: "180.00",
      serviceFee: "162.00",
      platformFee: "18.00",
      duration: "4 hours",
      rating: 4.5,
      customerRating: 4,
      customerReview: "Good work, but took longer than expected. Final result looks great.",
      completionNotes: "Applied primer and two coats of paint. Protected furniture and cleaned up thoroughly.",
      rated: true
    },
    {
      id: "BK006",
      serviceType: "Plumbing",
      technicianName: "Robert Martinez",
      technicianPhone: "+1 (555) 678-9012",
      date: "2024-12-20",
      time: "15:30",
      address: "987 Birch Road, Springfield, IL 62706",
      description: "Toilet replacement in guest bathroom. Old toilet was cracked at the base.",
      status: "cancelled",
      totalCost: "220.00",
      serviceFee: "198.00",
      platformFee: "22.00",
      duration: "2 hours",
      rating: 4.3,
      customerRating: null,
      customerReview: null,
      completionNotes: null,
      rated: false
    }
  ]);

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
  const [filteredBookings, setFilteredBookings] = useState(allBookings);

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
        isAuthenticated={true}
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
              Showing {filteredBookings?.length} of {allBookings?.length} bookings
            </span>
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
    </div>
  );
};

export default CustomerBookingHistory;