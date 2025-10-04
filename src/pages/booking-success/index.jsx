import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { getBookings } from '../../utils/api';
import { useSelector } from 'react-redux';

const BookingSuccess = () => {
  const { id } = useParams();
  const user = useSelector((s) => s.auth.user);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getBookings({ id });
        const b = Array.isArray(data) ? data[0] : data;
        if (mounted) setBooking(b || null);
      } catch (e) {
        setError('Could not load booking.');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="customer" isAuthenticated={!!user} onLogout={() => {}} />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <Icon name="CheckCircle2" size={48} className="mx-auto text-success mb-3" />
          <h1 className="text-2xl font-semibold text-foreground">Booking Requested</h1>
          <p className="text-sm text-muted-foreground mt-1">Your booking has been submitted successfully.</p>
          {loading && <p className="mt-4 text-sm text-muted-foreground">Loading booking...</p>}
          {error && <p className="mt-4 text-sm text-error">{error}</p>}
          {booking && (
            <div className="mt-6 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="text-sm"><span className="text-muted-foreground">Booking ID:</span> <span className="font-medium">{booking.id}</span></div>
                <div className="text-sm"><span className="text-muted-foreground">Service:</span> <span className="font-medium">{booking.serviceName}</span></div>
                <div className="text-sm"><span className="text-muted-foreground">Date:</span> <span className="font-medium">{new Date(booking.date).toLocaleString()}</span></div>
                <div className="text-sm"><span className="text-muted-foreground">Location:</span> <span className="font-medium">{booking.location}</span></div>
                <div className="text-sm"><span className="text-muted-foreground">Technician:</span> <span className="font-medium">{booking.technicianName || 'Auto-matched soon'}</span></div>
                <div className="text-sm"><span className="text-muted-foreground">Status:</span> <span className="font-medium capitalize">{booking.status}</span></div>
              </div>
              {typeof booking.totalCost !== 'undefined' && (
                <div className="mt-4 text-sm"><span className="text-muted-foreground">Estimated Cost:</span> <span className="font-medium">${booking.totalCost?.toFixed ? booking.totalCost.toFixed(2) : booking.totalCost}</span></div>
              )}
            </div>
          )}
          <div className="mt-6 text-left">
            <details className="rounded-md border bg-white p-3">
              <summary className="cursor-pointer text-sm font-medium text-foreground">Email Preview</summary>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Subject: Booking Confirmation #{booking?.id}</p>
                <p>Hi {user?.name || 'Customer'},</p>
                <p>Your booking for {booking?.serviceName} on {new Date(booking?.date).toLocaleString()} at {booking?.location} has been received.</p>
                <p>Technician: {booking?.technicianName || 'To be assigned'}</p>
                {typeof booking?.totalCost !== 'undefined' && (
                  <p>Estimated Cost: ${booking.totalCost?.toFixed ? booking.totalCost.toFixed(2) : booking.totalCost}</p>
                )}
                <p>Thank you for choosing ServiceConnect!</p>
              </div>
            </details>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/customer-booking-history">
              <Button variant="default" iconName="History" iconPosition="left">My Bookings</Button>
            </Link>
            {booking && (
              <Link to={`/reschedule/${booking.id}`}>
                <Button variant="outline" iconName="Calendar" iconPosition="left">Reschedule</Button>
              </Link>
            )}
            <Link to="/customer-dashboard">
              <Button variant="outline" iconName="Home" iconPosition="left">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingSuccess;