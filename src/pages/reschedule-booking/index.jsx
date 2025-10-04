import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import { getBookings, updateBooking } from '../../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { showError, showSuccess } from '../../features/notifications/notificationsSlice';

const RescheduleBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const notify = useDispatch();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getBookings({ id });
        const b = Array.isArray(data) ? data[0] : data;
        if (b && mounted) {
          const d = new Date(b.date);
          setDate(d.toISOString().slice(0,10));
          setTime(d.toISOString().slice(11,16));
        }
      } catch {}
      finally { setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const iso = `${date}T${time}:00`;
    try {
      await updateBooking(id, { date: iso });
      notify(showSuccess('Booking rescheduled'));
      navigate(`/booking-success/${id}`);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to reschedule booking';
      notify(showError(msg));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="customer" isAuthenticated={!!user} onLogout={() => {}} />
      <main className="container mx-auto px-4 py-10 max-w-lg">
        <div className="rounded-lg border bg-card p-6">
          <h1 className="text-xl font-semibold text-foreground">Reschedule Booking</h1>
          <p className="text-sm text-muted-foreground">Pick a new date and time for your booking.</p>
          {loading && <p className="mt-2 text-sm text-muted-foreground">Loading...</p>}
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-foreground">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md border p-2" required />
            </div>
            <div>
              <label className="text-sm text-foreground">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full rounded-md border p-2" required />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" variant="default">Update</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RescheduleBooking;