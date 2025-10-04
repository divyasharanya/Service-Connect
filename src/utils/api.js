// API utilities with optional mock fallback
import axios from "axios";
import { SERVICES } from "data/services";
import { TECHNICIANS, PENDING_TECHNICIANS } from "data/technicians";
import { BOOKINGS } from "data/bookings";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http = axios.create({ baseURL: API_BASE_URL });

export async function getServices() {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.get('/services');
    return data;
  }
  await delay();
  return [...SERVICES];
}

export async function getTechnicians(params = {}) {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.get('/technicians', { params });
    return data;
  }
  await delay();
  return [...TECHNICIANS];
}

export async function getTechnicianByUserId(userId) {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.get(`/technicians/by-user/${userId}`);
    return data;
  }
  await delay();
  const dummy = TECHNICIANS[0];
  return dummy ? { id: dummy.id, name: dummy.name, service: dummy.service, rating: dummy.rating, verified: dummy.verified, earnings: dummy.earnings } : null;
}

export async function getPendingTechnicians() {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.get('/technicians?status=pending');
    return data;
  }
  await delay();
  return [...PENDING_TECHNICIANS];
}

export async function getBookings(params = {}) {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.get('/bookings', { params });
    return data;
  }
  await delay();
  let data = [...BOOKINGS];
  if (params.customerId) {
    data = data.filter(b => b.customerId === params.customerId);
  }
  if (params.technicianId) {
    data = data.filter(b => b.technicianId === params.technicianId);
  }
  return data;
}

export async function login({ email, password, role = "customer" }) {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.post('/auth/login', { email, password });
    return data;
  }
  await delay();
  return {
    token: "dummy_token",
    user: { id: "user_1", name: email.split("@")[0], role },
  };
}

export async function register({ name, email, password, role = 'customer' }) {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.post('/auth/register', { name, email, password, role });
    return data;
  }
  await delay();
  return {
    token: "dummy_token",
    user: { id: "user_1", name: name || email.split('@')[0], email, role },
  };
}

export async function createBooking({ serviceId, date, location, customerId, technicianId = null }) {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.post('/bookings', { serviceId, date, location, customerId, technicianId });
    return data;
  }
  await delay();
  const created = {
    id: `bk_${Math.random().toString(36).slice(2, 8)}`,
    serviceId,
    serviceName: SERVICES.find(s => s.id === serviceId)?.name || 'Service',
    customerId,
    customerName: 'You',
    technicianId,
    technicianName: null,
    date,
    location,
    status: 'pending',
    rating: null,
    review: null,
    totalCost: SERVICES.find(s => s.id === serviceId)?.priceFrom || 0,
    serviceFee: 0,
    platformFee: 0,
  };
  return created;
}

export async function updateBookingStatus(id, status) {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.patch(`/bookings/${id}`, { status });
    return data;
  }
  await delay();
  return { id, status };
}

export async function updateBooking(id, body) {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.patch(`/bookings/${id}`, body);
    return data;
  }
  await delay();
  return { id, ...body };
}

export async function approveTechnician(id) {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.post(`/technicians/${id}/approve`);
    return data;
  }
  await delay();
  return { id, verified: true };
}

export async function rejectTechnician(id) {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.post(`/technicians/${id}/reject`);
    return data;
  }
  await delay();
  return { id, verified: false };
}
