/**
 * Seed script for development database
 * Populates sample data: users, categories, microtasks, jobs
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password for all users
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create categories
  console.log('Creating categories...');
  const webDevCategory = await prisma.category.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: {
      slug: 'web-development',
      name: 'Web Development',
      description: 'Frontend, backend, and full-stack web development',
      icon: 'code',
      is_active: true,
    },
  });

  const mobileCategory = await prisma.category.upsert({
    where: { slug: 'mobile-development' },
    update: {},
    create: {
      slug: 'mobile-development',
      name: 'Mobile Development',
      description: 'iOS, Android, and cross-platform mobile apps',
      icon: 'smartphone',
      is_active: true,
    },
  });

  const designCategory = await prisma.category.upsert({
    where: { slug: 'ui-ux-design' },
    update: {},
    create: {
      slug: 'ui-ux-design',
      name: 'UI/UX Design',
      description: 'User interface and experience design',
      icon: 'palette',
      is_active: true,
    },
  });

  // Create clients
  console.log('Creating clients...');
  const clients = [];
  for (let i = 1; i <= 5; i++) {
    const client = await prisma.user.upsert({
      where: { email: `client${i}@example.com` },
      update: {},
      create: {
        email: `client${i}@example.com`,
        full_name: `Client ${i}`,
        user_type: 'client',
        password_hash: passwordHash,
        profile_complete: true,
        email_verified: true,
      },
    });
    clients.push(client);
  }

  // Create workers
  console.log('Creating workers...');
  const workers = [];
  const skills = [
    ['React', 'TypeScript', 'Node.js'],
    ['Vue.js', 'Python', 'Django'],
    ['Angular', 'Java', 'Spring Boot'],
    ['Flutter', 'Dart', 'Firebase'],
    ['Swift', 'iOS', 'UIKit'],
    ['Kotlin', 'Android', 'Jetpack'],
    ['Figma', 'Adobe XD', 'Sketch'],
    ['Photoshop', 'Illustrator', 'InDesign'],
    ['AWS', 'Docker', 'Kubernetes'],
    ['MongoDB', 'PostgreSQL', 'Redis'],
  ];

  for (let i = 1; i <= 10; i++) {
    const worker = await prisma.user.upsert({
      where: { email: `worker${i}@example.com` },
      update: {},
      create: {
        email: `worker${i}@example.com`,
        full_name: `Worker ${i}`,
        user_type: 'worker',
        password_hash: passwordHash,
        profile_complete: true,
        email_verified: true,
      },
    });

    // Create profile
    await prisma.profile.upsert({
      where: { user_id: worker.id },
      update: {},
      create: {
        user_id: worker.id,
        headline: `Experienced ${skills[i - 1][0]} Developer`,
        bio: `I am a skilled developer with expertise in ${skills[i - 1].join(', ')}.`,
        skills: skills[i - 1],
        hourly_rate_min: 500 + i * 100,
        hourly_rate_max: 1000 + i * 200,
        verified_level: i <= 3 ? 'premium' : i <= 6 ? 'professional' : 'basic',
        score: 70 + i * 2,
      },
    });

    // Create shift credits
    await prisma.shiftCredits.upsert({
      where: { user_id: worker.id },
      update: {},
      create: {
        user_id: worker.id,
        balance: 20 + i * 5,
        reserved: 0,
      },
    });

    workers.push(worker);
  }

  // Create microtasks
  console.log('Creating microtasks...');
  const microtasks = [];
  const microtaskData = [
    {
      title: 'Build React Component Library',
      description: 'Create a reusable component library with 10+ components',
      category_id: webDevCategory.id,
      complexity: 'intermediate' as const,
      delivery_window: '1-4w' as const,
      base_price_min: 5000,
      base_price_max: 15000,
    },
    {
      title: 'Design Mobile App UI',
      description: 'Design complete UI/UX for a mobile application',
      category_id: designCategory.id,
      complexity: 'advanced' as const,
      delivery_window: '1-4w' as const,
      base_price_min: 10000,
      base_price_max: 25000,
    },
    {
      title: 'Setup CI/CD Pipeline',
      description: 'Configure CI/CD pipeline for a web application',
      category_id: webDevCategory.id,
      complexity: 'intermediate' as const,
      delivery_window: '3-7d' as const,
      base_price_min: 3000,
      base_price_max: 8000,
    },
    {
      title: 'Build REST API',
      description: 'Develop RESTful API with authentication and documentation',
      category_id: webDevCategory.id,
      complexity: 'intermediate' as const,
      delivery_window: '1-4w' as const,
      base_price_min: 8000,
      base_price_max: 20000,
    },
    {
      title: 'Mobile App Prototype',
      description: 'Create interactive prototype for mobile app',
      category_id: mobileCategory.id,
      complexity: 'beginner' as const,
      delivery_window: '3-7d' as const,
      base_price_min: 2000,
      base_price_max: 5000,
    },
  ];

  for (const data of microtaskData) {
    const microtask = await prisma.microtask.create({
      data: {
        ...data,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      },
    });
    microtasks.push(microtask);
  }

  // Create jobs
  console.log('Creating jobs...');
  const jobs = [];
  for (let i = 0; i < 5; i++) {
    const client = clients[i % clients.length];
    const microtask = microtasks[i % microtasks.length];

    const job = await prisma.job.create({
      data: {
        client_id: client.id,
        title: `Job ${i + 1}: ${microtask.title}`,
        description: microtask.description,
        category_id: microtask.category_id,
        microtask_id: microtask.id,
        custom: false,
        status: i < 3 ? 'open' : 'assigned',
        price_fixed: microtask.base_price_max,
        price_currency: 'INR',
        delivery_window: microtask.delivery_window,
        required_skills: ['React', 'TypeScript'],
      },
    });
    jobs.push(job);

    // Create applications for open jobs
    if (i < 3) {
      for (let j = 0; j < 2; j++) {
        const worker = workers[j];
        await prisma.application.create({
          data: {
            project_id: job.id,
            worker_id: worker.id,
            cover_text: `I'm interested in this job and have relevant experience.`,
            proposed_price: microtask.base_price_max,
            status: j === 0 ? 'pending' : 'accepted',
            credits_used: 3,
          },
        });
      }
    }
  }

  // Create admin user
  console.log('Creating admin user...');
  await prisma.user.upsert({
    where: { email: 'admin@2ndshift.com' },
    update: {},
    create: {
      email: 'admin@2ndshift.com',
      full_name: 'Admin User',
      user_type: 'admin',
      password_hash: passwordHash,
      profile_complete: true,
      email_verified: true,
    },
  });

  console.log('✅ Seed completed!');
  console.log(`Created:`);
  console.log(`- ${clients.length} clients`);
  console.log(`- ${workers.length} workers`);
  console.log(`- ${microtasks.length} microtasks`);
  console.log(`- ${jobs.length} jobs`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
