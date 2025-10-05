import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import JobRequest from "components/JobRequest";
import { getBookings, getTechnicianByUserId, updateBookingStatus as apiUpdateBookingStatus } from "utils/api";
import { setBookings, setBookingsStatus } from "features/bookings/bookingsSlice";
import { useDispatch as useReduxDispatch } from "react-redux";
import { showError, showSuccess } from "features/notifications/notificationsSlice";

export default function TechnicianDashboard() {
  const dispatch = useDispatch();
  const notify = useReduxDispatch();
  const { items: bookings, status } = useSelector((s) => s.bookings);
  const authUser = useSelector((s) => s.auth.user);

  const [techId, setTechId] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState('all'); // all | accepted | in-progress | completed | cancelled
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (authUser?.role === 'technician' && authUser?.id) {
          const t = await getTechnicianByUserId(authUser.id);
          if (mounted) setTechId(t?.id || null);
        }
      } catch {}
    })();
    return () => { mounted = false; };
  }, [authUser?.id, authUser?.role]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        dispatch(setBookingsStatus("loading"));
        const data = await getBookings(techId ? { technicianId: techId } : {});
        if (mounted) dispatch(setBookings(data));
      } catch (e) {
        dispatch(setBookingsStatus("error"));
      } finally {
        dispatch(setBookingsStatus("idle"));
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch, techId]);

  const myIncoming = bookings.filter((b) => (!techId || b.technicianId === techId) && b.status === "pending");
  const myHistory = bookings
    .filter((b) => (!techId || b.technicianId === techId) && b.status !== "pending")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredHistory = myHistory.filter((b) => {
    if (statusFilter !== 'all' && (b.status || '').toLowerCase() !== statusFilter) return false;
    const d = new Date(b.date);
    if (dateFrom && d < new Date(dateFrom)) return false;
    if (dateTo && d > new Date(dateTo)) return false;
    return true;
  });

  const onAccept = async (id) => {
    try {
      await apiUpdateBookingStatus(id, 'accepted');
      notify(showSuccess('Job accepted'));
      const data = await getBookings(techId ? { technicianId: techId } : {});
      dispatch(setBookings(data));
    } catch (e) {
      notify(showError('Failed to accept job'));
    }
  };
  const onReject = async (id) => {
    try {
      await apiUpdateBookingStatus(id, 'rejected');
      notify(showSuccess('Job rejected'));
      const data = await getBookings(techId ? { technicianId: techId } : {});
      dispatch(setBookings(data));
    } catch (e) {
      notify(showError('Failed to reject job'));
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-semibold text-slate-800">Incoming Job Requests</h1>
      {status === "loading" && <p className="mt-4 text-slate-500">Loading...</p>}
      <div className="mt-4 grid grid-cols-1 gap-4">
        {myIncoming.length === 0 && (
          <div className="rounded-md border bg-white p-6 text-slate-600">No pending requests.</div>
        )}
        {myIncoming.map((req) => (
          <JobRequest key={req.id} request={req} onAccept={onAccept} onReject={onReject} />
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">My Job History</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 rounded-md text-sm ${statusFilter==='all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>All</button>
            <button onClick={() => setStatusFilter('accepted')} className={`px-3 py-1.5 rounded-md text-sm ${statusFilter==='accepted' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>Accepted</button>
            <button onClick={() => setStatusFilter('in-progress')} className={`px-3 py-1.5 rounded-md text-sm ${statusFilter==='in-progress' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>In Progress</button>
            <button onClick={() => setStatusFilter('completed')} className={`px-3 py-1.5 rounded-md text-sm ${statusFilter==='completed' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>Completed</button>
            <button onClick={() => setStatusFilter('cancelled')} className={`px-3 py-1.5 rounded-md text-sm ${statusFilter==='cancelled' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>Cancelled</button>
            <div className="ml-4 flex items-center gap-2">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-md border px-2 py-1 text-sm" />
              <span className="text-sm text-slate-600">to</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-md border px-2 py-1 text-sm" />
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="rounded-md border px-2 py-1 text-sm text-slate-700 hover:bg-slate-100">Clear</button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {filteredHistory.length === 0 && (
            <div className="rounded-md border bg-white p-6 text-slate-600">No jobs found for this filter.</div>
          )}
          {filteredHistory.map((job) => (
            <div key={job.id} className="space-y-2">
              <JobRequest request={job} />
              <div>
                <Link to={`/technician-active-job/${job.id}`} className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 text-sm">View Job</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}