import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Services
  const svcPlumber = await prisma.service.upsert({
    where: { id: 'svc_plumber' },
    update: {},
    create: { id: 'svc_plumber', name: 'Plumber', description: 'Pipes, leaks, installation', priceFrom: 49 }
  });
  const svcCarpenter = await prisma.service.upsert({
    where: { id: 'svc_carpenter' },
    update: {},
    create: { id: 'svc_carpenter', name: 'Carpenter', description: 'Furniture, fittings, repairs', priceFrom: 59 }
  });
  const svcElectrician = await prisma.service.upsert({
    where: { id: 'svc_electrician' },
    update: {},
    create: { id: 'svc_electrician', name: 'Electrician', description: 'Wiring, fixtures, troubleshooting', priceFrom: 69 }
  });

  // Users
  const hash = (pw) => bcrypt.hashSync(pw, 10);
  const userCustomer = await prisma.user.upsert({
    where: { email: 'customer@serviceconnect.com' },
    update: {},
    create: { email: 'customer@serviceconnect.com', passwordHash: hash('customer123'), name: 'Customer User', role: 'customer' }
  });
  const userAdmin = await prisma.user.upsert({
    where: { email: 'admin@serviceconnect.com' },
    update: {},
    create: { email: 'admin@serviceconnect.com', passwordHash: hash('admin123'), name: 'Admin User', role: 'admin' }
  });
  const userTech1 = await prisma.user.upsert({
    where: { email: 'technician@serviceconnect.com' },
    update: {},
    create: { email: 'technician@serviceconnect.com', passwordHash: hash('tech123'), name: 'Ravi Kumar', role: 'technician' }
  });

  // Technicians
  const tech1 = await prisma.technician.upsert({
    where: { userId: userTech1.id },
    update: {},
    create: { userId: userTech1.id, serviceId: svcPlumber.id, rating: 4.6, verified: true, earnings: 325.5 }
  });

  // Bookings
  await prisma.booking.upsert({
    where: { id: 'bk_1' },
    update: {},
    create: {
      id: 'bk_1',
      serviceId: svcPlumber.id,
      customerId: userCustomer.id,
      technicianId: tech1.id,
      scheduledAt: new Date(),
      location: 'Bengaluru',
      status: 'pending'
    }
  });
  await prisma.booking.upsert({
    where: { id: 'bk_2' },
    update: {},
    create: {
      id: 'bk_2',
      serviceId: svcElectrician.id,
      customerId: userCustomer.id,
      technicianId: tech1.id,
      scheduledAt: new Date(Date.now() + 86400000),
      location: 'Hyderabad',
      status: 'accepted'
    }
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
