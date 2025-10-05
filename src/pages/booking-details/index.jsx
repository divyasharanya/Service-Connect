import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { getBookings, updateBookingStatus, updateBooking, getTechnicianByUserId } from '../../utils/api';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [techId, setTechId] = useState(null);
  const [forbidden, setForbidden] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const data = await getBookings({ id });
      const item = Array.isArray(data) ? data[0] : data;
      setBooking(item || null);
    } catch (e) {
      setError('Failed to load booking');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  // Resolve technician id for role-based access
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (user?.role === 'technician' && user?.id) {
          const t = await getTechnicianByUserId(user.id);
          if (mounted) setTechId(t?.id || null);
        } else {
          setTechId(null);
        }
      } catch {
        if (mounted) setTechId(null);
      }
    })();
    return () => { mounted = false; };
  }, [user?.id, user?.role]);

  // Access check when booking/user/techId changes
  useEffect(() => {
    if (!booking || !user) { setForbidden(false); return; }
    if (user.role === 'admin') { setForbidden(false); return; }
    if (user.role === 'customer') { setForbidden(booking.customerId !== user.id); return; }
    if (user.role === 'technician') { setForbidden(!techId || booking.technicianId !== techId); return; }
    setForbidden(true);
  }, [booking, user, techId]);

  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return 'bg-amber-100 text-amber-700';
    if (s === 'accepted') return 'bg-emerald-100 text-emerald-700';
    if (s === 'in-progress') return 'bg-blue-100 text-blue-700';
    if (s === 'completed') return 'bg-slate-100 text-slate-700';
    if (s === 'cancelled' || s === 'rejected') return 'bg-rose-100 text-rose-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={user?.role || 'customer'} isAuthenticated={!!user} onLogout={() => navigate('/user-login')} />
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Booking Details</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)} iconName="ArrowLeft" iconPosition="left">Back</Button>
            <Link to="/customer-booking-history"><Button variant="ghost" iconName="History" iconPosition="left">History</Button></Link>
          </div>
        </div>

        {loading && <div className="rounded-md border bg-white p-4 text-slate-600">Loading...</div>}
        {error && <div className="rounded-md border bg-white p-4 text-rose-700">{error}</div>}
        {!loading && forbidden && (
          <div className="rounded-md border bg-white p-4 text-rose-700">
            You don’t have permission to view this booking.
          </div>
        )}
        {!loading && booking && !forbidden && (
          <div className="space-y-4">
            <div className="rounded-md border bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium text-foreground">{booking.serviceName}</div>
                <span className={`rounded px-2 py-0.5 text-xs ${statusBadge(booking.status)}`}>{booking.status}</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-slate-700">
                <div><span className="text-slate-500">When:</span> {new Date(booking.date).toLocaleString()}</div>
                <div><span className="text-slate-500">Where:</span> {booking.location}</div>
                <div><span className="text-slate-500">Technician:</span> {booking.technicianName || 'Unassigned'}</div>
                <div><span className="text-slate-500">Cost:</span> ${Number(booking.totalCost ?? 0).toFixed(2)}</div>
              </div>
            </div>

            <div className="rounded-md border bg-white p-4">
              <div className="mb-3 text-sm font-medium text-slate-800">Actions</div>
              <div className="flex flex-wrap gap-2">
                {(booking.status === 'pending' || booking.status === 'accepted' || booking.status === 'in-progress') && (
                  <Link to={`/reschedule/${booking.id}`}>
                    <Button variant="outline" iconName="Calendar" iconPosition="left">Reschedule</Button>
                  </Link>
                )}
                {(booking.status === 'pending' || booking.status === 'accepted') && (
                  <Button variant="outline" iconName="X" iconPosition="left" onClick={async () => {
                    try { await updateBookingStatus(booking.id, 'cancelled'); await load(); } catch {}
                  }}>Cancel</Button>
                )}
              </div>
            </div>

            {booking.review && (
              <div className="rounded-md border bg-white p-4">
                <div className="mb-1 text-sm font-medium text-slate-800">Your Review</div>
                <div className="text-sm text-slate-700">{booking.review}</div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingDetails;
