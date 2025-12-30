/**
 * Database Seed Script
 * Creates admin user and default data from environment variables
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword, checkPasswordStrength } from '../src/lib/password.js';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding database...\n');
  
  // ============= Create Admin User =============
  
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Admin';
  
  if (!adminEmail || !adminPassword) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
    process.exit(1);
  }
  
  // Check password strength
  const strengthError = checkPasswordStrength(adminPassword);
  if (strengthError) {
    console.error(`❌ Admin password is too weak: ${strengthError}`);
    process.exit(1);
  }
  
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail.toLowerCase() },
  });
  
  if (existingAdmin) {
    console.log(`✓ Admin user already exists: ${adminEmail}`);
  } else {
    const passwordHash = await hashPassword(adminPassword);
    await prisma.adminUser.create({
      data: {
        email: adminEmail.toLowerCase(),
        name: adminName,
        passwordHash,
      },
    });
    console.log(`✓ Created admin user: ${adminEmail}`);
  }
  
  // ============= Create Default Site Settings =============
  
  const existingSettings = await prisma.siteSettings.findFirst();
  
  if (existingSettings) {
    console.log('✓ Site settings already exist');
  } else {
    await prisma.siteSettings.create({
      data: {
        siteName: 'My Portfolio',
        siteDescription: 'Personal portfolio and resume website',
        ownerName: adminName,
        ownerEmail: adminEmail,
        ownerTitle: 'Software Engineer',
        socialLinks: {
          github: '',
          linkedin: '',
          twitter: '',
        },
        theme: {
          fontPrimary: 'Inter',
          fontSecondary: 'JetBrains Mono',
          colorBackground: '0 0% 100%',
          colorForeground: '222.2 84% 4.9%',
          colorPrimary: '221.2 83.2% 53.3%',
          colorAccent: '210 40% 96.1%',
          colorMuted: '210 40% 96.1%',
        },
        navigation: [
          { id: 'home', label: 'Home', href: '/', enabled: true, order: 0 },
          { id: 'projects', label: 'Projects', href: '/projects', enabled: true, order: 1 },
          { id: 'writing', label: 'Writing', href: '/writing', enabled: true, order: 2 },
          { id: 'resume', label: 'Resume', href: '/resume', enabled: true, order: 3 },
          { id: 'contact', label: 'Contact', href: '/contact', enabled: true, order: 4 },
        ],
        seoDefaults: {
          title: 'My Portfolio',
          description: 'Personal portfolio and resume website',
        },
      },
    });
    console.log('✓ Created default site settings');
  }
  
  // ============= Create Default Home Layout =============
  
  const existingLayout = await prisma.homeLayout.findFirst();
  
  if (existingLayout) {
    console.log('✓ Home layout already exists');
  } else {
    await prisma.homeLayout.create({
      data: {
        sections: [
          { id: 'hero', type: 'hero', enabled: true, order: 0 },
          { id: 'experience', type: 'experience', enabled: true, order: 1 },
          { id: 'featuredProjects', type: 'featuredProjects', enabled: true, order: 2 },
          { id: 'howIWork', type: 'howIWork', enabled: true, order: 3 },
          { id: 'metrics', type: 'metrics', enabled: true, order: 4 },
          { id: 'writing', type: 'writing', enabled: true, order: 5 },
          { id: 'availability', type: 'availability', enabled: true, order: 6 },
          { id: 'contactCta', type: 'contactCta', enabled: true, order: 7 },
        ],
      },
    });
    console.log('✓ Created default home layout');
  }
  
  // ============= Create Default Writing Settings =============
  
  const existingWritingSettings = await prisma.writingSettings.findFirst();
  
  if (existingWritingSettings) {
    console.log('✓ Writing settings already exist');
  } else {
    await prisma.writingSettings.create({
      data: {
        id: 'default',
        pageTitle: 'Selected Writing',
        pageIntro: 'Thoughts on software engineering, product development, and technology.',
      },
    });
    console.log('✓ Created default writing settings');
  }
  
  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
