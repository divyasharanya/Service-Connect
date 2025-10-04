import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "features/auth/authSlice";
import { showInfo } from "features/notifications/notificationsSlice";

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
          <NavLink to="/customer-dashboard" className={classes}>
            Customer
          </NavLink>
          <NavLink to="/service-booking-form" className={classes}>
            Book
          </NavLink>
          <NavLink to="/customer-booking-history" className={classes}>
            History
          </NavLink>

          {/* Technician-only */}
          {isTechnician && (
            <>
              <NavLink to="/technician-dashboard" className={classes}>
                Tech Jobs
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
