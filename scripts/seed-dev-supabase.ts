/**
 * Seed script for development database (Supabase version)
 * Populates sample data: users, categories, microtasks, jobs
 */

import { supabaseAdmin } from '../lib/supabase/admin';
import { hashPassword } from '../lib/auth/password';

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password for all users
  const passwordHash = await hashPassword('password123');

  // Create categories
  console.log('Creating categories...');
  const { data: webDevCategory } = await supabaseAdmin
    .from('categories')
    .upsert({
      slug: 'web-development',
      name: 'Web Development',
      description: 'Frontend, backend, and full-stack web development',
      icon: 'code',
      is_active: true,
    }, { onConflict: 'slug' })
    .select()
    .single();

  const { data: mobileCategory } = await supabaseAdmin
    .from('categories')
    .upsert({
      slug: 'mobile-development',
      name: 'Mobile Development',
      description: 'iOS, Android, and cross-platform mobile apps',
      icon: 'smartphone',
      is_active: true,
    }, { onConflict: 'slug' })
    .select()
    .single();

  const { data: designCategory } = await supabaseAdmin
    .from('categories')
    .upsert({
      slug: 'ui-ux-design',
      name: 'UI/UX Design',
      description: 'User interface and experience design',
      icon: 'palette',
      is_active: true,
    }, { onConflict: 'slug' })
    .select()
    .single();

  // Create clients
  console.log('Creating clients...');
  const clients = [];
  for (let i = 1; i <= 5; i++) {
    const { data: client } = await supabaseAdmin
      .from('users')
      .upsert({
        email: `client${i}@example.com`,
        full_name: `Client ${i}`,
        user_type: 'client',
        password_hash: passwordHash,
        profile_complete: true,
        email_verified: true,
      }, { onConflict: 'email' })
      .select()
      .single();
    if (client) clients.push(client);
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
    const { data: worker } = await supabaseAdmin
      .from('users')
      .upsert({
        email: `worker${i}@example.com`,
        full_name: `Worker ${i}`,
        user_type: 'worker',
        password_hash: passwordHash,
        profile_complete: true,
        email_verified: true,
      }, { onConflict: 'email' })
      .select()
      .single();

    if (worker) {
      // Create profile
      await supabaseAdmin
        .from('profiles')
        .upsert({
          user_id: worker.id,
          headline: `Experienced ${skills[i - 1][0]} Developer`,
          bio: `I am a skilled developer with expertise in ${skills[i - 1].join(', ')}.`,
          skills: skills[i - 1],
          hourly_rate_min: 500 + i * 100,
          hourly_rate_max: 1000 + i * 200,
          verified_level: i <= 3 ? 'premium' : i <= 6 ? 'professional' : 'basic',
          score: 70 + i * 2,
        }, { onConflict: 'user_id' });

      // Create shift credits
      await supabaseAdmin
        .from('shift_credits')
        .upsert({
          user_id: worker.id,
          balance: 20 + i * 5,
          reserved: 0,
        }, { onConflict: 'user_id' });

      workers.push(worker);
    }
  }

  // Create microtasks
  console.log('Creating microtasks...');
  const microtasks = [];
  const microtaskData = [
    {
      title: 'Build React Component Library',
      description: 'Create a reusable component library with 10+ components',
      category_id: webDevCategory?.id,
      complexity: 'intermediate',
      delivery_window: '1-4w',
      base_price_min: 5000,
      base_price_max: 15000,
    },
    {
      title: 'Design Mobile App UI',
      description: 'Design complete UI/UX for a mobile application',
      category_id: designCategory?.id,
      complexity: 'advanced',
      delivery_window: '1-4w',
      base_price_min: 10000,
      base_price_max: 25000,
    },
    {
      title: 'Setup CI/CD Pipeline',
      description: 'Configure CI/CD pipeline for a web application',
      category_id: webDevCategory?.id,
      complexity: 'intermediate',
      delivery_window: '3-7d',
      base_price_min: 3000,
      base_price_max: 8000,
    },
    {
      title: 'Build REST API',
      description: 'Develop RESTful API with authentication and documentation',
      category_id: webDevCategory?.id,
      complexity: 'intermediate',
      delivery_window: '1-4w',
      base_price_min: 8000,
      base_price_max: 20000,
    },
    {
      title: 'Mobile App Prototype',
      description: 'Create interactive prototype for mobile app',
      category_id: mobileCategory?.id,
      complexity: 'beginner',
      delivery_window: '3-7d',
      base_price_min: 2000,
      base_price_max: 5000,
    },
  ];

  for (const data of microtaskData) {
    const { data: microtask } = await supabaseAdmin
      .from('microtasks')
      .upsert({
        ...data,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      }, { onConflict: 'slug' })
      .select()
      .single();
    if (microtask) microtasks.push(microtask);
  }

  // Create jobs
  console.log('Creating jobs...');
  const jobs = [];
  for (let i = 0; i < 5; i++) {
    const client = clients[i % clients.length];
    const microtask = microtasks[i % microtasks.length];

    if (client && microtask) {
      const { data: job } = await supabaseAdmin
        .from('jobs')
        .insert({
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
        })
        .select()
        .single();

      if (job) {
        jobs.push(job);

        // Create applications for open jobs
        if (i < 3) {
          for (let j = 0; j < 2; j++) {
            const worker = workers[j];
            if (worker) {
              await supabaseAdmin
                .from('applications')
                .insert({
                  project_id: job.id,
                  worker_id: worker.id,
                  cover_text: `I'm interested in this job and have relevant experience.`,
                  proposed_price: microtask.base_price_max,
                  status: j === 0 ? 'pending' : 'accepted',
                  credits_used: 3,
                });
            }
          }
        }
      }
    }
  }

  // Create admin user
  console.log('Creating admin user...');
  await supabaseAdmin
    .from('users')
    .upsert({
      email: 'admin@2ndshift.com',
      full_name: 'Admin User',
      user_type: 'admin',
      password_hash: passwordHash,
      profile_complete: true,
      email_verified: true,
    }, { onConflict: 'email' });

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
  });
