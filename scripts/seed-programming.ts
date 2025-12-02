/**
 * Seed script for Programming category
 * Creates Programming category, microtasks, expert profiles, and demo jobs
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { PROGRAMMING_MICROTASKS } from '../data/highValueProgrammingTasks'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Programming expert profiles
const PROGRAMMING_EXPERTS = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.programming@demo.2ndshift.in',
    skills: ['Python', 'Java', 'Golang', 'Distributed Systems', 'API Architecture'],
    certifications: ['AWS Certified Developer', 'Oracle Java SE 11 Developer'],
    verified_level: 'premium',
    score: 92,
    hourly_rate: 1800,
    availability: { hours_per_week: 25, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Fixed memory leak in production Java microservice',
      'Optimized Python API for 10x throughput improvement',
      'Refactored legacy monolith to microservices'
    ]
  },
  {
    name: 'Priya Sharma',
    email: 'priya.programming@demo.2ndshift.in',
    skills: ['Node.js', 'TypeScript', 'NestJS', 'API Performance', 'Concurrency'],
    certifications: ['AWS Certified Developer'],
    verified_level: 'premium',
    score: 89,
    hourly_rate: 1600,
    availability: { hours_per_week: 20, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Debugged high-load API scalability issues',
      'Implemented fault-tolerant job processing system',
      'Fixed concurrency bugs in Node.js service'
    ]
  },
  {
    name: 'Amit Patel',
    email: 'amit.programming@demo.2ndshift.in',
    skills: ['Golang', 'Rust', 'C++', 'Systems Programming', 'Performance'],
    certifications: [],
    verified_level: 'professional',
    score: 87,
    hourly_rate: 2000,
    availability: { hours_per_week: 15, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Implemented high-performance Rust backend module',
      'Fixed production crash in C++ service',
      'Optimized Golang API for low latency'
    ]
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.programming@demo.2ndshift.in',
    skills: ['Python', 'Django', 'FastAPI', 'Database Optimization', 'ORM'],
    certifications: ['AWS Certified Developer'],
    verified_level: 'professional',
    score: 85,
    hourly_rate: 1500,
    availability: { hours_per_week: 30, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Fixed database/ORM performance bottlenecks',
      'Migrated Express to FastAPI',
      'Optimized Django queries for 5x improvement'
    ]
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.programming@demo.2ndshift.in',
    skills: ['Java', 'Spring', 'Microservices', 'Kafka', 'gRPC'],
    certifications: ['Oracle Java SE 11 Developer'],
    verified_level: 'premium',
    score: 91,
    hourly_rate: 1900,
    availability: { hours_per_week: 20, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Debugged distributed systems issues with Kafka',
      'Fixed high CPU issue in Java microservice',
      'Implemented gRPC service communication'
    ]
  },
  {
    name: 'Anjali Mehta',
    email: 'anjali.programming@demo.2ndshift.in',
    skills: ['Node.js', 'Express', 'API Gateway', 'Rate Limiting', 'Caching'],
    certifications: [],
    verified_level: 'professional',
    score: 84,
    hourly_rate: 1400,
    availability: { hours_per_week: 25, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Implemented rate limiting and caching layers',
      'Optimized API gateway (Kong/NGINX)',
      'Fixed middleware performance issues'
    ]
  },
  {
    name: 'Rohit Gupta',
    email: 'rohit.programming@demo.2ndshift.in',
    skills: ['Python', 'Java', 'Legacy Code', 'Refactoring', 'TypeScript'],
    certifications: ['AWS Certified Developer'],
    verified_level: 'professional',
    score: 86,
    hourly_rate: 1600,
    availability: { hours_per_week: 20, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Cleaned and upgraded legacy Python codebase',
      'Strong static typing conversion (TS types refactor)',
      'Migration from Node to NestJS'
    ]
  },
  {
    name: 'Kavita Nair',
    email: 'kavita.programming@demo.2ndshift.in',
    skills: ['Golang', 'Concurrency', 'Thread Safety', 'Queue Systems', 'Job Processing'],
    certifications: [],
    verified_level: 'professional',
    score: 88,
    hourly_rate: 1700,
    availability: { hours_per_week: 18, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Fixed concurrency and thread-safety issues',
      'Re-architected queue consumers',
      'Implemented fault-tolerant job processing'
    ]
  },
  {
    name: 'Suresh Iyer',
    email: 'suresh.programming@demo.2ndshift.in',
    skills: ['Java', 'Spring Boot', 'API Performance', 'Memory Profiling', 'Leak Resolution'],
    certifications: ['Oracle Java SE 11 Developer'],
    verified_level: 'premium',
    score: 90,
    hourly_rate: 1850,
    availability: { hours_per_week: 22, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Resolved API memory leaks',
      'Memory profiling and leak resolution',
      'Production crash and core dump analysis'
    ]
  },
  {
    name: 'Deepa Joshi',
    email: 'deepa.programming@demo.2ndshift.in',
    skills: ['Python', 'FastAPI', 'API Security', 'Auth Hardening', 'Backend Services'],
    certifications: ['AWS Certified Developer'],
    verified_level: 'professional',
    score: 83,
    hourly_rate: 1450,
    availability: { hours_per_week: 28, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Auth/security hardening for backend services',
      'Reduced production API error rates',
      'Implemented security best practices'
    ]
  },
  {
    name: 'Arjun Nair',
    email: 'arjun.programming@demo.2ndshift.in',
    skills: ['Node.js', 'TypeScript', 'NestJS', 'Microservices', 'API Architecture'],
    certifications: [],
    verified_level: 'professional',
    score: 85,
    hourly_rate: 1550,
    availability: { hours_per_week: 24, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Legacy monolith to microservices refactor',
      'Module extraction and API design',
      'Microservices communication setup'
    ]
  },
  {
    name: 'Meera Desai',
    email: 'meera.programming@demo.2ndshift.in',
    skills: ['Java', 'Spring', 'Database Optimization', 'ORM', 'Query Tuning'],
    certifications: ['Oracle Java SE 11 Developer'],
    verified_level: 'professional',
    score: 84,
    hourly_rate: 1500,
    availability: { hours_per_week: 26, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Database/ORM performance bottleneck fixes',
      'Optimized Postgres ORM queries',
      'Query optimization and indexing'
    ]
  },
  {
    name: 'Rohan Chatterjee',
    email: 'rohan.programming@demo.2ndshift.in',
    skills: ['Golang', 'Rust', 'Systems Programming', 'Performance', 'Concurrency'],
    certifications: [],
    verified_level: 'premium',
    score: 93,
    hourly_rate: 2100,
    availability: { hours_per_week: 15, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Rust/Golang backend module implementation',
      'High-performance backend tuning',
      'Systems-level performance optimization'
    ]
  },
  {
    name: 'Neha Gupta',
    email: 'neha.programming@demo.2ndshift.in',
    skills: ['Python', 'Django', 'API Performance', 'Scalability', 'High Load'],
    certifications: ['AWS Certified Developer'],
    verified_level: 'professional',
    score: 87,
    hourly_rate: 1650,
    availability: { hours_per_week: 20, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'High-load API scalability tuning',
      'API performance optimization',
      'Scalability improvements for production'
    ]
  },
  {
    name: 'Pradeep Kumar',
    email: 'pradeep.programming@demo.2ndshift.in',
    skills: ['Java', 'Spring Boot', 'CI/CD', 'Code Issues', 'Pipeline Fixes'],
    certifications: ['Oracle Java SE 11 Developer'],
    verified_level: 'professional',
    score: 82,
    hourly_rate: 1400,
    availability: { hours_per_week: 30, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'CI pipeline failure due to code-level issue',
      'Fixed build errors and test failures',
      'Resolved dependency conflicts'
    ]
  },
  {
    name: 'Shruti Patel',
    email: 'shruti.programming@demo.2ndshift.in',
    skills: ['Node.js', 'Express', 'Error Handling', 'Production Issues', 'API Reliability'],
    certifications: [],
    verified_level: 'professional',
    score: 86,
    hourly_rate: 1550,
    availability: { hours_per_week: 22, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Production API error rate reduction',
      'Improved error handling and reliability',
      'Fixed production issues'
    ]
  },
  {
    name: 'Aditya Rao',
    email: 'aditya.programming@demo.2ndshift.in',
    skills: ['Python', 'Java', 'Memory Management', 'Profiling', 'Leak Detection'],
    certifications: ['AWS Certified Developer'],
    verified_level: 'premium',
    score: 91,
    hourly_rate: 1800,
    availability: { hours_per_week: 18, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'API memory leak debugging',
      'Memory profiling and optimization',
      'Heap dump analysis and fixes'
    ]
  },
  {
    name: 'Divya Menon',
    email: 'divya.programming@demo.2ndshift.in',
    skills: ['Golang', 'Concurrency', 'Distributed Systems', 'Kafka', 'gRPC'],
    certifications: [],
    verified_level: 'professional',
    score: 88,
    hourly_rate: 1700,
    availability: { hours_per_week: 25, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Distributed systems debugging (Kafka, gRPC)',
      'Fixed message ordering issues',
      'Implemented retry mechanisms'
    ]
  },
  {
    name: 'Kiran Shah',
    email: 'kiran.programming@demo.2ndshift.in',
    skills: ['Java', 'Spring', 'Microservices', 'Architecture', 'Refactoring'],
    certifications: ['Oracle Java SE 11 Developer'],
    verified_level: 'premium',
    score: 90,
    hourly_rate: 1900,
    availability: { hours_per_week: 20, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Legacy monolith to microservices refactor',
      'Service boundary design',
      'Backward compatibility implementation'
    ]
  },
  {
    name: 'Nisha Agarwal',
    email: 'nisha.programming@demo.2ndshift.in',
    skills: ['Python', 'FastAPI', 'API Gateway', 'Kong', 'NGINX', 'Traefik'],
    certifications: ['AWS Certified Developer'],
    verified_level: 'professional',
    score: 85,
    hourly_rate: 1600,
    availability: { hours_per_week: 24, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'API gateway optimization (Kong/NGINX/Traefik)',
      'Routing rule tuning',
      'Load balancing optimization'
    ]
  },
  {
    name: 'Manish Verma',
    email: 'manish.programming@demo.2ndshift.in',
    skills: ['Node.js', 'TypeScript', 'Strong Typing', 'Code Quality', 'Refactoring'],
    certifications: [],
    verified_level: 'professional',
    score: 84,
    hourly_rate: 1500,
    availability: { hours_per_week: 26, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Strong static typing conversion (TS types refactor)',
      'Improved type safety',
      'Type coverage improvements'
    ]
  },
  {
    name: 'Swati Reddy',
    email: 'swati.programming@demo.2ndshift.in',
    skills: ['Python', 'Java', 'Legacy Code', 'Upgrades', 'Modernization'],
    certifications: ['AWS Certified Developer', 'Oracle Java SE 11 Developer'],
    verified_level: 'premium',
    score: 89,
    hourly_rate: 1750,
    availability: { hours_per_week: 20, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Cleaning and upgrading legacy Python/Java codebases',
      'Dependency updates',
      'Code modernization'
    ]
  },
  {
    name: 'Vivek Malhotra',
    email: 'vivek.programming@demo.2ndshift.in',
    skills: ['Golang', 'Rust', 'Backend Modules', 'Systems Programming', 'Performance'],
    certifications: [],
    verified_level: 'premium',
    score: 92,
    hourly_rate: 2000,
    availability: { hours_per_week: 16, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Rust/Golang backend module implementation',
      'High-performance module design',
      'Memory-safe implementations'
    ]
  },
  {
    name: 'Anita Singh',
    email: 'anita.programming@demo.2ndshift.in',
    skills: ['Java', 'Spring Boot', 'Production Debugging', 'Crash Analysis', 'Core Dumps'],
    certifications: ['Oracle Java SE 11 Developer'],
    verified_level: 'professional',
    score: 87,
    hourly_rate: 1650,
    availability: { hours_per_week: 22, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Production crash and core dump analysis',
      'Root cause identification',
      'Memory corruption fixes'
    ]
  },
  {
    name: 'Ravi Kumar',
    email: 'ravi.programming@demo.2ndshift.in',
    skills: ['Node.js', 'Express', 'Queue Systems', 'Job Processing', 'Fault Tolerance'],
    certifications: [],
    verified_level: 'professional',
    score: 86,
    hourly_rate: 1550,
    availability: { hours_per_week: 25, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Queue consumers re-architecture',
      'Fault-tolerant job processing',
      'Idempotency implementation'
    ]
  },
  {
    name: 'Sunita Patel',
    email: 'sunita.programming@demo.2ndshift.in',
    skills: ['Python', 'Django', 'Migration', 'Framework Upgrades', 'FastAPI'],
    certifications: ['AWS Certified Developer'],
    verified_level: 'professional',
    score: 85,
    hourly_rate: 1600,
    availability: { hours_per_week: 24, timezone: 'Asia/Kolkata', open_to_work: true },
    past_tasks: [
      'Migration from Express to FastAPI',
      'Framework migration strategy',
      'API compatibility maintenance'
    ]
  }
]

// Demo Programming jobs
const DEMO_PROGRAMMING_JOBS = [
  {
    title: 'Fix high CPU issue in Java microservice',
    description: 'Production Java microservice experiencing high CPU usage. Need to identify root cause and implement fix. Service handles 10k+ requests/min.',
    price: 18000,
    delivery_window: '3-7d'
  },
  {
    title: 'Refactor Go API handlers for improved concurrency',
    description: 'Refactor existing Go API handlers to improve concurrency handling. Current implementation has race conditions under high load.',
    price: 22000,
    delivery_window: '1-4w'
  },
  {
    title: 'Debug API memory leak in Node.js service',
    description: 'Node.js API service experiencing memory leaks. Memory usage grows continuously over time. Need profiling and fix.',
    price: 15000,
    delivery_window: '3-7d'
  },
  {
    title: 'Optimize Postgres ORM queries in Python backend',
    description: 'Python Django backend has slow database queries. Need to optimize ORM queries, add indexes, and improve query patterns.',
    price: 12000,
    delivery_window: '3-7d'
  },
  {
    title: 'Fix concurrency bug in distributed queue system',
    description: 'Distributed queue system using Kafka has message ordering issues. Need to fix concurrency bugs and ensure proper ordering.',
    price: 25000,
    delivery_window: '1-4w'
  },
  {
    title: 'Migrate legacy Python monolith to microservices',
    description: 'Extract payment module from legacy Python monolith into microservice. Design API contracts and ensure backward compatibility.',
    price: 45000,
    delivery_window: '1-4w'
  },
  {
    title: 'Implement rate limiting and caching for high-traffic API',
    description: 'High-traffic REST API needs rate limiting and distributed caching layer. Implement Redis-based solution with proper invalidation.',
    price: 18000,
    delivery_window: '3-7d'
  },
  {
    title: 'Fix production crash in Rust backend service',
    description: 'Rust backend service crashes intermittently. Need core dump analysis, identify root cause, and implement fix.',
    price: 20000,
    delivery_window: '3-7d'
  },
  {
    title: 'Optimize API gateway (Kong) for better performance',
    description: 'Kong API gateway needs optimization. Tune routing rules, implement caching strategies, and improve throughput.',
    price: 16000,
    delivery_window: '3-7d'
  },
  {
    title: 'Strong TypeScript typing refactor for large codebase',
    description: 'Large JavaScript/TypeScript codebase needs strong static typing. Add proper type definitions and improve type safety.',
    price: 22000,
    delivery_window: '1-4w'
  }
]

async function seedProgrammingCategory() {
  console.log('🌱 Seeding Programming category...')
  
  // Create or get Programming category
  const { data: existingCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'programming')
    .single()
  
  let categoryId: string
  
  if (existingCategory) {
    categoryId = existingCategory.id
    console.log('✅ Programming category already exists')
  } else {
    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({
        slug: 'programming',
        name: 'Senior Backend & Systems Programming',
        description: 'Complex backend, API performance, architecture, concurrency, migrations, and production-critical programming tasks',
        icon: 'server',
        is_active: true
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error creating Programming category:', error)
      return null
    }
    
    categoryId = newCategory.id
    console.log('✅ Created Programming category')
  }
  
  return categoryId
}

async function seedProgrammingMicrotasks(categoryId: string) {
  console.log('📋 Seeding Programming microtasks...')
  
  let count = 0
  for (const task of PROGRAMMING_MICROTASKS) {
    const slug = task.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    const { error } = await supabase
      .from('microtasks')
      .upsert({
        title: task.title,
        slug: slug,
        description: task.description,
        category_id: categoryId,
        complexity: task.complexity,
        delivery_window: task.delivery_window,
        base_price_min: task.price_min * 100, // Convert to paise
        base_price_max: task.price_max * 100,
        default_commission_percent: task.default_commission_percent
      }, {
        onConflict: 'slug'
      })
    
    if (error) {
      console.error(`Error seeding microtask ${task.title}:`, error)
    } else {
      count++
    }
  }
  
  console.log(`✅ Seeded ${count} Programming microtasks`)
}

async function seedProgrammingExperts() {
  console.log('👥 Seeding Programming expert profiles...')
  
  // Hash password for all users
  const passwordHash = 'DemoExpert123!' // In production, use proper hashing
  
  let count = 0
  for (const expert of PROGRAMMING_EXPERTS) {
    try {
      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: expert.email,
        password: passwordHash,
        email_confirm: true
      })
      
      if (authError || !authUser.user) {
        console.error(`Error creating auth user for ${expert.name}:`, authError)
        continue
      }
      
      // Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authUser.user.id,
          email: expert.email,
          full_name: expert.name,
          user_type: 'worker',
          email_verified: true
        })
      
      if (userError) {
        console.error(`Error creating user record for ${expert.name}:`, userError)
        continue
      }
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authUser.user.id,
          headline: `Senior ${expert.skills[0]} Developer`,
          bio: `Experienced ${expert.skills.join(', ')} specialist with expertise in ${expert.past_tasks[0]?.toLowerCase() || 'backend programming'}.`,
          skills: expert.skills,
          verified_level: expert.verified_level,
          score: expert.score,
          hourly_rate_min: expert.hourly_rate * 100,
          hourly_rate_max: (expert.hourly_rate * 1.5) * 100,
          availability: expert.availability,
          portfolio_links: [`https://github.com/${expert.name.toLowerCase().replace(/\s+/g, '-')}`],
          programming_badge: true
        })
      
      if (profileError) {
        console.error(`Error creating profile for ${expert.name}:`, profileError)
        continue
      }
      
      count++
    } catch (error) {
      console.error(`Error seeding expert ${expert.name}:`, error)
    }
  }
  
  console.log(`✅ Seeded ${count} Programming expert profiles`)
}

async function seedProgrammingJobs(categoryId: string) {
  console.log('💼 Seeding demo Programming jobs...')
  
  // Get client IDs
  const { data: clients } = await supabase
    .from('users')
    .select('id')
    .eq('user_type', 'client')
    .limit(10)
  
  if (!clients || clients.length === 0) {
    console.log('⚠️  No clients found, skipping job seeding')
    return
  }
  
  // Get Programming microtasks
  const { data: microtasks } = await supabase
    .from('microtasks')
    .select('id, title')
    .eq('category_id', categoryId)
    .limit(10)
  
  let count = 0
  for (let i = 0; i < DEMO_PROGRAMMING_JOBS.length; i++) {
    const job = DEMO_PROGRAMMING_JOBS[i]
    const client = clients[i % clients.length]
    const microtask = microtasks?.[i % (microtasks.length || 1)]
    
    const { error } = await supabase
      .from('jobs')
      .insert({
        client_id: client.id,
        title: job.title,
        description: job.description,
        category_id: categoryId,
        microtask_id: microtask?.id,
        custom: !microtask,
        status: 'open',
        price_fixed: job.price * 100,
        delivery_window: job.delivery_window,
        urgency: 'normal'
      })
    
    if (error) {
      console.error(`Error seeding job ${job.title}:`, error)
    } else {
      count++
    }
  }
  
  console.log(`✅ Seeded ${count} demo Programming jobs`)
}

async function main() {
  console.log('🚀 Starting Programming category seed...\n')
  
  try {
    const categoryId = await seedProgrammingCategory()
    if (!categoryId) {
      console.error('❌ Failed to create Programming category')
      process.exit(1)
    }
    
    await seedProgrammingMicrotasks(categoryId)
    await seedProgrammingExperts()
    await seedProgrammingJobs(categoryId)
    
    console.log('\n✅ All Programming seeding completed successfully!')
    console.log('\nSummary:')
    console.log(`- Category: Programming`)
    console.log(`- Microtasks: ${PROGRAMMING_MICROTASKS.length}`)
    console.log(`- Expert Profiles: ${PROGRAMMING_EXPERTS.length}`)
    console.log(`- Demo Jobs: ${DEMO_PROGRAMMING_JOBS.length}`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

main()
