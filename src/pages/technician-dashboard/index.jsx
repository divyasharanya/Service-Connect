import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobRequest from "components/JobRequest";
import { getBookings, getTechnicianByUserId, updateBookingStatus as apiUpdateBookingStatus } from "utils/api";
import { setBookings, setBookingsStatus, updateBookingStatus } from "features/bookings/bookingsSlice";
import { useDispatch as useReduxDispatch } from "react-redux";
import { showError, showSuccess } from "features/notifications/notificationsSlice";

export default function TechnicianDashboard() {
  const dispatch = useDispatch();
  const notify = useReduxDispatch();
  const { items: bookings, status } = useSelector((s) => s.bookings);
  const authUser = useSelector((s) => s.auth.user);

  const [techId, setTechId] = React.useState(null);

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
    </div>
  );
}