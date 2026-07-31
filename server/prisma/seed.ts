import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CRM database seed...');

  // Clean existing tables
  await prisma.notification.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      id: 'user-admin',
      name: 'Alex Vance',
      email: 'alex.vance@aralicrm.com',
      role: 'ADMIN',
      title: 'VP of Global Operations',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const sarah = await prisma.user.create({
    data: {
      id: 'user-sarah',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@aralicrm.com',
      role: 'SALES_REP',
      title: 'Senior Account Executive',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  const marcus = await prisma.user.create({
    data: {
      id: 'user-marcus',
      name: 'Marcus Chen',
      email: 'marcus.chen@aralicrm.com',
      role: 'SALES_REP',
      title: 'Enterprise Account Manager',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const elena = await prisma.user.create({
    data: {
      id: 'user-elena',
      name: 'Elena Rostova',
      email: 'elena.rostova@aralicrm.com',
      role: 'MANAGER',
      title: 'Customer Success Director',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log('✅ Users created');

  // 2. Create Companies
  const acme = await prisma.company.create({
    data: {
      id: 'company-acme',
      name: 'Acme Corporation',
      industry: 'Enterprise Software',
      annualRevenue: 12500000,
      status: 'CUSTOMER',
      website: 'https://acme.com',
      phone: '+1 (555) 019-2834',
    },
  });

  const stark = await prisma.company.create({
    data: {
      id: 'company-stark',
      name: 'Stark Tech Solutions',
      industry: 'Cybersecurity & Defense',
      annualRevenue: 45000000,
      status: 'PROSPECT',
      website: 'https://starktech.io',
      phone: '+1 (555) 082-3948',
    },
  });

  const apex = await prisma.company.create({
    data: {
      id: 'company-apex',
      name: 'Apex Logistics Corp',
      industry: 'Global Supply Chain',
      annualRevenue: 8200000,
      status: 'LEAD',
      website: 'https://apexlogistics.org',
      phone: '+1 (555) 034-9122',
    },
  });

  const nova = await prisma.company.create({
    data: {
      id: 'company-nova',
      name: 'Nova BioHealth',
      industry: 'Healthcare & Biotech',
      annualRevenue: 22000000,
      status: 'CUSTOMER',
      website: 'https://novabiohealth.com',
      phone: '+1 (555) 091-8823',
    },
  });

  console.log('✅ Companies created');

  // 3. Create Contacts
  const john = await prisma.contact.create({
    data: {
      id: 'contact-john',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      phone: '+1 (555) 010-1111',
      title: 'Chief Technology Officer',
      companyId: acme.id,
    },
  });

  const emily = await prisma.contact.create({
    data: {
      id: 'contact-emily',
      firstName: 'Emily',
      lastName: 'Watson',
      email: 'e.watson@acme.com',
      phone: '+1 (555) 010-2222',
      title: 'VP of Engineering',
      companyId: acme.id,
    },
  });

  const tony = await prisma.contact.create({
    data: {
      id: 'contact-tony',
      firstName: 'Anthony',
      lastName: 'Stark',
      email: 'tony@starktech.io',
      phone: '+1 (555) 088-8000',
      title: 'Chief Executive Officer',
      companyId: stark.id,
    },
  });

  const pepper = await prisma.contact.create({
    data: {
      id: 'contact-pepper',
      firstName: 'Pepper',
      lastName: 'Potts',
      email: 'pepper@starktech.io',
      phone: '+1 (555) 088-9000',
      title: 'Chief Operating Officer',
      companyId: stark.id,
    },
  });

  const carl = await prisma.contact.create({
    data: {
      id: 'contact-carl',
      firstName: 'Carl',
      lastName: 'Sagan',
      email: 'carl@apexlogistics.org',
      phone: '+1 (555) 031-1000',
      title: 'Director of Procurement',
      companyId: apex.id,
    },
  });

  const lisa = await prisma.contact.create({
    data: {
      id: 'contact-lisa',
      firstName: 'Dr. Lisa',
      lastName: 'Cuddy',
      email: 'lcuddy@novabiohealth.com',
      phone: '+1 (555) 092-2000',
      title: 'VP of Research & Development',
      companyId: nova.id,
    },
  });

  console.log('✅ Contacts created');

  // 4. Initial Seed Assignments
  const assign1 = await prisma.assignment.create({
    data: {
      userId: sarah.id,
      assignedByUserId: admin.id,
      companyId: acme.id,
      role: 'Account Owner',
    },
  });

  const assign2 = await prisma.assignment.create({
    data: {
      userId: marcus.id,
      assignedByUserId: admin.id,
      companyId: stark.id,
      role: 'Lead Account Manager',
    },
  });

  const assign3 = await prisma.assignment.create({
    data: {
      userId: elena.id,
      assignedByUserId: admin.id,
      contactId: john.id,
      role: 'Customer Success Manager',
    },
  });

  console.log('✅ Assignments created');

  // 5. Initial Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: sarah.id,
        title: 'New Company Assignment',
        message: `Alex Vance assigned you to Acme Corporation as Account Owner.`,
        type: 'ASSIGNMENT',
        entityType: 'COMPANY',
        entityId: acme.id,
        isRead: false,
      },
      {
        userId: marcus.id,
        title: 'New Company Assignment',
        message: `Alex Vance assigned you to Stark Tech Solutions as Lead Account Manager.`,
        type: 'ASSIGNMENT',
        entityType: 'COMPANY',
        entityId: stark.id,
        isRead: false,
      },
      {
        userId: elena.id,
        title: 'New Contact Assignment',
        message: `Alex Vance assigned you to John Doe (Acme Corporation) as Customer Success Manager.`,
        type: 'ASSIGNMENT',
        entityType: 'CONTACT',
        entityId: john.id,
        isRead: false,
      },
      {
        userId: sarah.id,
        title: 'System Welcome',
        message: 'Welcome to Arali Live CRM. You will receive real-time notifications when accounts or contacts are assigned to you.',
        type: 'SYSTEM',
        entityType: 'GENERAL',
        isRead: true,
      },
    ],
  });

  console.log('✅ Notifications seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
