import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: (origin, cb) => {
    // Allow dev origins (localhost/127.0.0.1) and non-browser clients (no origin)
    if (!origin) return cb(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: false,
}));
app.use(express.json());

// HTTP server + Socket.io
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: [/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/],
    methods: ['GET', 'POST', 'PATCH'],
  },
});

io.on('connection', (socket) => {
  // Optionally auth later
  socket.on('disconnect', () => {});
});

app.set('io', io);

// Email transport
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

let transporter = null;
async function ensureTransporter() {
  if (transporter) return transporter;
  if (smtpHost && smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    return transporter;
  }
  // Dev fallback: create Ethereal test account so we can preview emails
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
    tls: { rejectUnauthorized: false }
  });
  console.log(`[email] Using Ethereal test SMTP account: ${testAccount.user}`);
  return transporter;
}

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Auth
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Email is required' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond with success to prevent enumeration
    if (!user) {
      return res.json({ message: 'If an account exists, a reset link has been sent.' });
    }
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await prisma.user.update({ where: { id: user.id }, data: { resetTokenHash: hash, resetTokenExpiresAt: expires } });

    // Ensure we have a mail transporter (uses Ethereal in dev if SMTP not set)
    const tx = await ensureTransporter();

    const resetLink = `${frontendUrl.replace(/\/$/, '')}/reset-password/${token}`;
    const info = await tx.sendMail({
      from: smtpUser || 'no-reply@serviceconnect.local',
      to: email,
      subject: 'Reset your ServiceConnect password',
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click the link to reset your password:</p><p><a href=\"${resetLink}\">${resetLink}</a></p>`
    });

    // Dev helpers: log preview URL and token; return in response for local dev
    let previewUrl = null;
    try {
      previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.log(`[email] Preview URL: ${previewUrl}`);
      console.log(`[dev] Password reset token for ${email}: ${token}`);
      console.log(`[dev] Reset link: ${resetLink}`);
    } catch {}

    const isProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production';
    const usingCustomSmtp = Boolean(smtpHost && smtpUser && smtpPass);
    if (!isProd && !usingCustomSmtp) {
      return res.json({ message: 'If an account exists, a reset link has been sent.', previewUrl, resetLink, token });
    }

    res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ message: 'Token and password are required' });
  try {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const now = new Date();
    const user = await prisma.user.findFirst({ where: { resetTokenHash: hash, resetTokenExpiresAt: { gt: now } } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null } });

    res.json({ message: 'Password has been reset successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dev-only: direct password reset without email (guarded by env flag)
app.post('/api/auth/reset-password-direct', async (req, res) => {
  try {
    const enabled = String(process.env.ALLOW_DIRECT_PASSWORD_RESET || 'false').toLowerCase() === 'true';
    if (!enabled) return res.status(403).json({ message: 'Direct password reset is disabled' });
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null } });
    return res.json({ message: 'Password has been reset successfully' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

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

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, serviceId, serviceName } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: 'User already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || email.split('@')[0],
        role: role || 'customer',
      },
    });

    // If registering a technician, create a technician record (unverified by default)
    if ((role || 'customer') === 'technician') {
      let svcId = serviceId || null;
      if (!svcId && serviceName) {
        const svc = await prisma.service.findFirst({ where: { name: { contains: serviceName, mode: 'insensitive' } } });
        if (svc) svcId = svc.id;
      }
      // If still no service id, pick first available service as a fallback to allow onboarding
      if (!svcId) {
        const firstSvc = await prisma.service.findFirst();
        svcId = firstSvc?.id || null;
      }
      if (svcId) {
        await prisma.technician.create({
          data: { userId: created.id, serviceId: svcId, rating: 0, verified: false, earnings: 0 }
        });
      }
    }

    const token = 'dummy_token';
    res.status(201).json({ token, user: { id: created.id, name: created.name, email: created.email, role: created.role } });
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

// Technician by userId
app.get('/api/technicians/by-user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const t = await prisma.technician.findUnique({ where: { userId }, include: { user: true, service: true } });
    if (!t) return res.status(404).json({ message: 'Technician not found' });
    res.json({
      id: t.id,
      name: t.user.name,
      service: t.service.name,
      rating: Number(t.rating),
      verified: t.verified,
      earnings: Number(t.earnings)
    });
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
    const { technicianId, customerId, id } = req.query;
    const where = {
      ...(id ? { id: String(id) } : {}),
      ...(technicianId ? { technicianId: String(technicianId) } : {}),
      ...(customerId ? { customerId: String(customerId) } : {}),
    };
    const bookings = await prisma.booking.findMany({
      where,
      include: { service: true, technician: { include: { user: true } }, customer: true },
      orderBy: { createdAt: 'desc' }
    });
    const payload = bookings.map(b => {
      const base = Number(b.service.priceFrom ?? 0) || 0;
      const platformFee = Number((base * 0.1).toFixed(2));
      const serviceFee = Number((base - platformFee).toFixed(2));
      const totalCost = Number(base.toFixed(2));
      return ({
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
        totalCost,
        serviceFee,
        platformFee,
      });
    });
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

    // Validate foreign keys with clear messages
    const [service, customer] = await Promise.all([
      prisma.service.findUnique({ where: { id: serviceId } }),
      prisma.user.findUnique({ where: { id: customerId } }),
    ]);
    if (!service) {
      return res.status(400).json({ message: 'Invalid serviceId. Please select a valid service.' });
    }
    if (!customer) {
      return res.status(400).json({ message: 'Invalid customer. Please log in again.' });
    }
    let assignedTechnicianId = technicianId ?? null;
    if (assignedTechnicianId) {
      const tech = await prisma.technician.findUnique({ where: { id: assignedTechnicianId } });
      if (!tech) {
        return res.status(400).json({ message: 'Invalid technicianId.' });
      }
    }

    // Auto-match technician if not provided: pick top-rated verified technician for the service
    if (!assignedTechnicianId) {
      const match = await prisma.technician.findFirst({
        where: { serviceId, verified: true },
        orderBy: { rating: 'desc' },
      });
      if (match) assignedTechnicianId = match.id;
    }

    const created = await prisma.booking.create({
      data: {
        serviceId,
        customerId,
        technicianId: assignedTechnicianId,
        scheduledAt: new Date(date),
        location,
        status: 'pending'
      },
      include: { service: true, customer: true, technician: { include: { user: true } } }
    });

    // Mock email notification
    try {
      console.log(`[email] Booking confirmation sent to ${created.customer.email} for booking ${created.id}`);
    } catch {}

    const base = Number(created.service.priceFrom ?? 0) || 0;
    const platformFee = Number((base * 0.1).toFixed(2));
    const serviceFee = Number((base - platformFee).toFixed(2));
    const totalCost = Number(base.toFixed(2));

    const payload = {
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
      totalCost,
      serviceFee,
      platformFee,
    };

    // Emit socket event for real-time updates
    try { io.emit('booking:update', payload); } catch {}

    res.status(201).json(payload);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/bookings/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status, rating, review, date, location } = req.body || {};

    const data = {};
    if (typeof status !== 'undefined') data.status = status;
    if (typeof rating !== 'undefined') data.rating = rating;
    if (typeof review !== 'undefined') data.review = review;
    if (typeof location !== 'undefined') data.location = location;
    if (typeof date !== 'undefined') {
      const d = new Date(date);
      if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid date format' });
      data.scheduledAt = d;
    }

    const updated = await prisma.booking.update({ where: { id }, data, include: { service: true, customer: true, technician: { include: { user: true } } } });

    const base = Number(updated.service?.priceFrom ?? 0) || 0;
    const platformFee = Number((base * 0.1).toFixed(2));
    const serviceFee = Number((base - platformFee).toFixed(2));
    const totalCost = Number(base.toFixed(2));

    const payload = {
      id: updated.id,
      serviceId: updated.serviceId,
      serviceName: updated.service?.name,
      customerId: updated.customerId,
      customerName: updated.customer?.name,
      technicianId: updated.technicianId ?? null,
      technicianName: updated.technician?.user?.name ?? null,
      date: (updated.scheduledAt ?? new Date()).toISOString(),
      location: updated.location,
      status: updated.status,
      rating: updated.rating ?? null,
      review: updated.review ?? null,
      totalCost,
      serviceFee,
      platformFee,
    };

    try { io.emit('booking:update', payload); } catch {}

    res.json(payload);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`[serviceconnect-backend] Listening on http://localhost:${PORT}`);
});
