import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "features/auth/authSlice";
import { showInfo } from "features/notifications/notificationsSlice";
import { getBookings, getTechnicianByUserId } from "utils/api";
import { io } from "socket.io-client";

function CustomerBell() {
  const navigate = useNavigate();
  const toasts = useSelector((s) => s.notifications.toasts);
  const [readIds, setReadIds] = React.useState(new Set());
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('notificationReadIds_v1');
      if (raw) setReadIds(new Set(JSON.parse(raw)));
    } catch {}
    const onStorage = (e) => {
      if (e.key === 'notificationReadIds_v1') {
        try {
          const raw = e.newValue;
          if (raw) setReadIds(new Set(JSON.parse(raw)));
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const unread = (toasts || []).filter((t) => !readIds.has(t.id)).length;
  return (
    <button onClick={() => navigate('/customer-booking-history')} className="relative inline-flex items-center justify-center rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100">
      <span className="sr-only">Open notifications</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs text-white">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const linkBase = "px-3 py-2 rounded-md text-sm font-medium";
  const classes = ({ isActive }) =>
    isActive
      ? `${linkBase} bg-blue-100 text-blue-700`
      : `${linkBase} text-slate-700 hover:bg-slate-100`;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    dispatch(showInfo('Logged out successfully'));
    const lastPublic = sessionStorage.getItem('lastPublicPath') || '/';
    navigate(lastPublic, { replace: true });
  };

  const isAdmin = user?.role === "admin";
  const isTechnician = user?.role === "technician";

  // Technician pending jobs badge (socket-incremental)
  const [pendingIds, setPendingIds] = React.useState(new Set());
  const [techId, setTechId] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isTechnician || !user?.id) { setTechId(null); setPendingIds(new Set()); return; }
      try {
        const t = await getTechnicianByUserId(user.id);
        if (!mounted) return;
        const tid = t?.id || null;
        setTechId(tid);
        if (!tid) { setPendingIds(new Set()); return; }
        // Initial fetch
        const data = await getBookings({ technicianId: tid });
        const ids = new Set((data || []).filter(b => (b.status || '').toLowerCase() === 'pending').map(b => b.id));
        setPendingIds(ids);
      } catch {
        if (mounted) setPendingIds(new Set());
      }
    })();
    return () => { mounted = false; };
  }, [isTechnician, user?.id]);

  React.useEffect(() => {
    if (!isTechnician || !user?.id || !techId) return;
    const socket = io(import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || 'http://localhost:4000', {
      transports: ['websocket'],
      reconnection: true,
    });
    const handler = (b) => {
      if (b.technicianId !== techId) return;
      const status = (b.status || '').toLowerCase();
      setPendingIds(prev => {
        const next = new Set(prev);
        if (status === 'pending') next.add(b.id); else next.delete(b.id);
        return next;
      });
    };
    socket.on('booking:update', handler);
    return () => { try { socket.off('booking:update', handler); socket.close(); } catch {} };
  }, [isTechnician, user?.id, techId]);

  // Track last public route for post-logout redirect
  React.useEffect(() => {
    const path = location.pathname || '/';
    const protectedPrefixes = ['/admin-dashboard', '/technician-dashboard', '/technician-active-job', '/technician-wallet'];
    const isProtected = protectedPrefixes.some((p) => path.startsWith(p));
    if (!isProtected) {
      sessionStorage.setItem('lastPublicPath', path);
    }
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-slate-800">
          ServiceConnect
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {/* Public/Customer links */}
          {!isTechnician && (
            <>
              <NavLink to="/customer-dashboard" className={classes}>
                Customer
              </NavLink>
              <NavLink to="/service-booking-form" className={classes}>
                Book
              </NavLink>
              <NavLink to="/customer-booking-history" className={classes}>
                History
              </NavLink>
            </>
          )}

          {/* Technician-only */}
          {isTechnician && (
            <>
                <NavLink to="/technician-dashboard" className={classes}>
                <span className="relative inline-flex items-center">
                  <span>Tech Jobs</span>
                  {pendingIds.size > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs text-white">
                      {pendingIds.size > 9 ? '9+' : pendingIds.size}
                    </span>
                  )}
                </span>
                </NavLink>
              <NavLink to="/technician-wallet" className={classes}>
                Wallet
              </NavLink>
            </>
          )}

          {/* Admin-only */}
          {isAdmin && (
            <NavLink to="/admin-dashboard" className={classes}>
              Admin
            </NavLink>
          )}

          {/* Customer bell with unread badge */}
          {user && user.role === 'customer' && (
            <CustomerBell />
          )}

          {/* Auth controls */}
          {!user ? (
            <>
              <NavLink to="/user-login" className={classes}>
                Login
              </NavLink>
              <NavLink to="/user-registration" className={classes}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                {user.role}
              </span>
              <button onClick={handleLogout} className={`${linkBase} text-rose-700 hover:bg-rose-50`}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
