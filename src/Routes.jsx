import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Navbar from "components/Navbar";
import RequireRole from "routes/RequireRole";

const NotFound = lazy(() => import("pages/NotFound"));
const UserLogin = lazy(() => import('./pages/user-login'));
const ServiceBookingForm = lazy(() => import('./pages/service-booking-form'));
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));
const CustomerBookingHistory = lazy(() => import('./pages/customer-booking-history'));
const UserRegistration = lazy(() => import('./pages/user-registration'));
const CustomerDashboard = lazy(() => import('./pages/customer-dashboard'));
const TechnicianDashboard = lazy(() => import('./pages/technician-dashboard'));
const TechnicianActiveJob = lazy(() => import('./pages/technician-active-job'));
const TechnicianWallet = lazy(() => import('./pages/technician-wallet'));
const BookingSuccess = lazy(() => import('./pages/booking-success'));
const RescheduleBooking = lazy(() => import('./pages/reschedule-booking'));

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<div className="p-4 text-slate-600">Loading...</div>}>
          <RouterRoutes>
            {/* Define your routes here */}
            <Route path="/" element={<CustomerDashboard />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/user-registration" element={<UserRegistration />} />

            {/* Customer */}
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/service-booking-form" element={<ServiceBookingForm />} />
          <Route path="/booking-success/:id" element={<BookingSuccess />} />
          <Route path="/reschedule/:id" element={<RescheduleBooking />} />
            <Route path="/customer-booking-history" element={<CustomerBookingHistory />} />

            {/* Technician (protected) */}
            <Route
              path="/technician-dashboard"
              element={
                <RequireRole roles={["technician"]}>
                  <TechnicianDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/technician-active-job/:id"
              element={
                <RequireRole roles={["technician"]}>
                  <TechnicianActiveJob />
                </RequireRole>
              }
            />
            <Route
              path="/technician-wallet"
              element={
                <RequireRole roles={["technician"]}>
                  <TechnicianWallet />
                </RequireRole>
              }
            />

            {/* Admin (protected) */}
            <Route
              path="/admin-dashboard"
              element={
                <RequireRole roles={["admin"]}>
                  <AdminDashboard />
                </RequireRole>
              }
            />

            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
