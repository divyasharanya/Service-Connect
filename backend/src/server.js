import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: false }));
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    // For simplicity, return a dummy token. Integrate JWT if needed.
    const token = 'dummy_token';
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Services
app.get('/api/services', async (_req, res) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { name: 'asc' } });
    res.json(services);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Technicians
app.get('/api/technicians', async (req, res) => {
  try {
    const { status } = req.query;
    let where = undefined;
    if (status === 'pending') where = { verified: false };
    if (status === 'verified') where = { verified: true };
    const technicians = await prisma.technician.findMany({
      where,
      include: { user: true, service: true },
      orderBy: { verified: 'desc' }
    });
    // Flatten shape for frontend expectations
    const payload = technicians.map(t => ({
      id: t.id,
      name: t.user.name,
      service: t.service.name,
      rating: Number(t.rating),
      verified: t.verified,
      earnings: Number(t.earnings)
    }));
    res.json(payload);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/technicians/:id/approve', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await prisma.technician.update({ where: { id }, data: { verified: true } });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/technicians/:id/reject', async (req, res) => {
  try {
    const id = req.params.id;
    // For demo, delete unverified pending technician or set a flag
    const updated = await prisma.technician.update({ where: { id }, data: { verified: false } });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const { technicianId, customerId } = req.query;
    const where = {
      ...(technicianId ? { technicianId: String(technicianId) } : {}),
      ...(customerId ? { customerId: String(customerId) } : {}),
    };
    const bookings = await prisma.booking.findMany({
      where,
      include: { service: true, technician: { include: { user: true } }, customer: true },
      orderBy: { createdAt: 'desc' }
    });
    const payload = bookings.map(b => ({
      id: b.id,
      serviceId: b.serviceId,
      serviceName: b.service.name,
      customerId: b.customerId,
      customerName: b.customer.name,
      technicianId: b.technicianId ?? null,
      technicianName: b.technician?.user?.name ?? null,
      date: b.scheduledAt.toISOString(),
      location: b.location,
      status: b.status,
      rating: b.rating ?? null,
      review: b.review ?? null,
    }));
    res.json(payload);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { serviceId, date, location, customerId, technicianId } = req.body || {};
    if (!serviceId || !date || !location || !customerId) {
      return res.status(400).json({ message: 'serviceId, date, location, customerId are required' });
    }
    const created = await prisma.booking.create({
      data: {
        serviceId,
        customerId,
        technicianId: technicianId ?? null,
        scheduledAt: new Date(date),
        location,
        status: 'pending'
      },
      include: { service: true, customer: true, technician: { include: { user: true } } }
    });
    res.status(201).json({
      id: created.id,
      serviceId: created.serviceId,
      serviceName: created.service.name,
      customerId: created.customerId,
      customerName: created.customer.name,
      technicianId: created.technicianId,
      technicianName: created.technician?.user?.name ?? null,
      date: created.scheduledAt.toISOString(),
      location: created.location,
      status: created.status,
      rating: created.rating ?? null,
      review: created.review ?? null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/bookings/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status, rating, review } = req.body || {};
    const updated = await prisma.booking.update({
      where: { id },
      data: { status, rating, review }
    });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`[serviceconnect-backend] Listening on http://localhost:${PORT}`);
});
