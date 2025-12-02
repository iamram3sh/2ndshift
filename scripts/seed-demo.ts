/**
 * Enhanced Demo Seed Script
 * Populates database with comprehensive demo data
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import { hashPassword } from '@/lib/auth/password';

async function main() {
  console.log('🌱 Starting demo seed...');

  const passwordHash = await hashPassword('password123');

  // Create categories
  console.log('Creating categories...');
  const categories = [];
  const categoryData = [
    { slug: 'web-development', name: 'Web Development', description: 'Frontend, backend, and full-stack web development', icon: 'code' },
    { slug: 'mobile-development', name: 'Mobile Development', description: 'iOS, Android, and cross-platform mobile apps', icon: 'smartphone' },
    { slug: 'ui-ux-design', name: 'UI/UX Design', description: 'User interface and experience design', icon: 'palette' },
    { slug: 'data-science', name: 'Data Science', description: 'Data analysis, ML, and AI', icon: 'database' },
    { slug: 'devops', name: 'DevOps', description: 'CI/CD, infrastructure, and cloud', icon: 'server' },
  ];

  for (const cat of categoryData) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .upsert({
        ...cat,
        is_active: true,
      }, { onConflict: 'slug' })
      .select()
      .single();
    
    if (!error && data) {
      categories.push(data);
      console.log(`  ✅ Created category: ${cat.name}`);
    }
  }

  // Create clients (5)
  console.log('\nCreating clients...');
  const clients = [];
  for (let i = 1; i <= 5; i++) {
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .upsert({
        email: `client${i}@demo.2ndshift.com`,
        full_name: `Demo Client ${i}`,
        user_type: 'client',
        password_hash: passwordHash,
        profile_complete: true,
        email_verified: true,
      }, { onConflict: 'email' })
      .select()
      .single();

    if (!userError && user) {
      clients.push(user);
      console.log(`  ✅ Created client: ${user.email}`);
    }
  }

  // Create workers (20)
  console.log('\nCreating workers...');
  const workers = [];
  const skills = [
    ['React', 'TypeScript', 'Node.js', 'Next.js'],
    ['Vue.js', 'Python', 'Django', 'PostgreSQL'],
    ['Angular', 'Java', 'Spring Boot', 'MongoDB'],
    ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
    ['Swift', 'iOS', 'UIKit', 'SwiftUI'],
    ['Kotlin', 'Android', 'Jetpack', 'Room'],
    ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
    ['Photoshop', 'Illustrator', 'InDesign', 'Branding'],
    ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    ['MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch'],
    ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
    ['TensorFlow', 'PyTorch', 'Computer Vision', 'NLP'],
    ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Ansible'],
    ['React Native', 'Expo', 'Redux', 'Firebase'],
    ['GraphQL', 'Apollo', 'Prisma', 'TypeScript'],
    ['Svelte', 'SvelteKit', 'Tailwind CSS', 'Vite'],
    ['WordPress', 'PHP', 'WooCommerce', 'Custom Themes'],
    ['Shopify', 'Liquid', 'JavaScript', 'API Integration'],
    ['Unity', 'C#', 'Game Development', '3D Modeling'],
    ['Blockchain', 'Solidity', 'Web3', 'Smart Contracts'],
  ];

  for (let i = 1; i <= 20; i++) {
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .upsert({
        email: `worker${i}@demo.2ndshift.com`,
        full_name: `Demo Worker ${i}`,
        user_type: 'worker',
        password_hash: passwordHash,
        profile_complete: true,
        email_verified: true,
      }, { onConflict: 'email' })
      .select()
      .single();

    if (!userError && user) {
      // Create profile
      await supabaseAdmin
        .from('profiles')
        .upsert({
          user_id: user.id,
          headline: `Experienced ${skills[i - 1][0]} Developer`,
          bio: `I am a skilled developer with expertise in ${skills[i - 1].slice(0, 3).join(', ')}.`,
          skills: skills[i - 1],
          hourly_rate_min: 500 + i * 50,
          hourly_rate_max: 1000 + i * 100,
          verified_level: i <= 5 ? 'premium' : i <= 10 ? 'professional' : i <= 15 ? 'basic' : 'none',
          score: 60 + i * 2,
        }, { onConflict: 'user_id' });

      // Create shift credits
      await supabaseAdmin
        .from('shift_credits')
        .upsert({
          user_id: user.id,
          balance: 20 + i * 5,
          reserved: 0,
        }, { onConflict: 'user_id' });

      workers.push(user);
      console.log(`  ✅ Created worker ${i}: ${user.email}`);
    }
  }

  // Create microtasks (15)
  console.log('\nCreating microtasks...');
  const microtasks = [];
  const microtaskData = [
    { title: 'Build React Component Library', description: 'Create a reusable component library with 10+ components', category: 'web-development', complexity: 'intermediate', delivery: 'oneTo4w', priceMin: 5000, priceMax: 15000 },
    { title: 'Design Mobile App UI', description: 'Design complete UI/UX for a mobile application', category: 'ui-ux-design', complexity: 'advanced', delivery: 'oneTo4w', priceMin: 10000, priceMax: 25000 },
    { title: 'Setup CI/CD Pipeline', description: 'Configure CI/CD pipeline for a web application', category: 'devops', complexity: 'intermediate', delivery: 'threeTo7d', priceMin: 3000, priceMax: 8000 },
    { title: 'Build REST API', description: 'Develop RESTful API with authentication and documentation', category: 'web-development', complexity: 'intermediate', delivery: 'oneTo4w', priceMin: 8000, priceMax: 20000 },
    { title: 'Mobile App Prototype', description: 'Create interactive prototype for mobile app', category: 'mobile-development', complexity: 'beginner', delivery: 'threeTo7d', priceMin: 2000, priceMax: 5000 },
    { title: 'Data Analysis Dashboard', description: 'Build analytics dashboard with charts and filters', category: 'data-science', complexity: 'intermediate', delivery: 'oneTo4w', priceMin: 6000, priceMax: 15000 },
    { title: 'Machine Learning Model', description: 'Train and deploy ML model for classification', category: 'data-science', complexity: 'advanced', delivery: 'oneTo6m', priceMin: 15000, priceMax: 40000 },
    { title: 'Dockerize Application', description: 'Containerize application with Docker and docker-compose', category: 'devops', complexity: 'beginner', delivery: 'threeTo7d', priceMin: 2000, priceMax: 5000 },
    { title: 'E-commerce Integration', description: 'Integrate payment gateway and shipping APIs', category: 'web-development', complexity: 'intermediate', delivery: 'oneTo4w', priceMin: 7000, priceMax: 18000 },
    { title: 'Mobile App Backend', description: 'Build backend API for mobile application', category: 'mobile-development', complexity: 'intermediate', delivery: 'oneTo4w', priceMin: 8000, priceMax: 20000 },
    { title: 'Brand Identity Design', description: 'Create complete brand identity with logo and guidelines', category: 'ui-ux-design', complexity: 'intermediate', delivery: 'threeTo7d', priceMin: 5000, priceMax: 12000 },
    { title: 'Database Optimization', description: 'Optimize database queries and add indexes', category: 'web-development', complexity: 'advanced', delivery: 'threeTo7d', priceMin: 4000, priceMax: 10000 },
    { title: 'API Documentation', description: 'Create comprehensive API documentation with examples', category: 'web-development', complexity: 'beginner', delivery: 'threeTo7d', priceMin: 1500, priceMax: 4000 },
    { title: 'React Native App', description: 'Build cross-platform mobile app with React Native', category: 'mobile-development', complexity: 'advanced', delivery: 'oneTo4w', priceMin: 12000, priceMax: 30000 },
    { title: 'Cloud Infrastructure Setup', description: 'Set up AWS/GCP infrastructure with IaC', category: 'devops', complexity: 'advanced', delivery: 'oneTo4w', priceMin: 10000, priceMax: 25000 },
  ];

  for (const mt of microtaskData) {
    const category = categories.find(c => c.slug === mt.category);
    if (!category) continue;

    const { data, error } = await supabaseAdmin
      .from('microtasks')
      .upsert({
        title: mt.title,
        slug: mt.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: mt.description,
        category_id: category.id,
        complexity: mt.complexity,
        delivery_window: mt.delivery,
        base_price_min: mt.priceMin,
        base_price_max: mt.priceMax,
        default_commission_percent: 10,
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (!error && data) {
      microtasks.push(data);
      console.log(`  ✅ Created microtask: ${mt.title}`);
    }
  }

  // Create jobs (5 open jobs)
  console.log('\nCreating jobs...');
  const jobs = [];
  for (let i = 0; i < 5; i++) {
    const client = clients[i % clients.length];
    const microtask = microtasks[i % microtasks.length];

    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .insert({
        client_id: client.id,
        title: `Demo Job ${i + 1}: ${microtask.title}`,
        description: microtask.description,
        category_id: microtask.category_id,
        microtask_id: microtask.id,
        custom: false,
        status: 'open',
        price_fixed: microtask.base_price_max,
        price_currency: 'INR',
        delivery_window: microtask.delivery_window,
      })
      .select()
      .single();

    if (!jobError && job) {
      jobs.push(job);
      console.log(`  ✅ Created job: ${job.title}`);
    }
  }

  // Create admin user
  console.log('\nCreating admin user...');
  const { data: admin } = await supabaseAdmin
    .from('users')
    .upsert({
      email: 'admin@demo.2ndshift.com',
      full_name: 'Demo Admin',
      user_type: 'admin',
      password_hash: passwordHash,
      profile_complete: true,
      email_verified: true,
    }, { onConflict: 'email' })
    .select()
    .single();

  if (admin) {
    console.log('  ✅ Created admin: admin@demo.2ndshift.com');
  }

  // Initialize platform config
  console.log('\nInitializing platform config...');
  const configs = [
    { key: 'credits_per_application', value: '3' },
    { key: 'worker_commission_verified', value: '0.05' },
    { key: 'worker_commission_unverified', value: '0.10' },
    { key: 'client_commission_percent', value: '0.04' },
    { key: 'escrow_fee_percent', value: '0.02' },
  ];

  for (const config of configs) {
    await supabaseAdmin
      .from('platform_config')
      .upsert({
        key: config.key,
        value: config.value,
        description: `Platform configuration for ${config.key}`,
      }, { onConflict: 'key' });
  }
  console.log('  ✅ Platform config initialized');

  console.log('\n✅ Demo seed completed!');
  console.log(`\nCreated:`);
  console.log(`- ${categories.length} categories`);
  console.log(`- ${clients.length} clients`);
  console.log(`- ${workers.length} workers`);
  console.log(`- ${microtasks.length} microtasks`);
  console.log(`- ${jobs.length} jobs`);
  console.log(`- 1 admin user`);
  console.log(`\nDemo credentials:`);
  console.log(`- Client: client1@demo.2ndshift.com / password123`);
  console.log(`- Worker: worker1@demo.2ndshift.com / password123`);
  console.log(`- Admin: admin@demo.2ndshift.com / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close connection if needed
  });
