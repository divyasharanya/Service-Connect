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

export async function getTechnicians() {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.get('/technicians');
    return data;
  }
  await delay();
  return [...TECHNICIANS];
}

export async function getPendingTechnicians() {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.get('/technicians?status=pending');
    return data;
  }
  await delay();
  return [...PENDING_TECHNICIANS];
}

export async function getBookings() {
  if (!USE_MOCK && API_BASE_URL) {
    const { data } = await http.get('/bookings');
    return data;
  }
  await delay();
  return [...BOOKINGS];
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
