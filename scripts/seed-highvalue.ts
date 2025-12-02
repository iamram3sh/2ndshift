/**
 * Seed script for high-value microtasks and demo data
 * Creates 50 high-value microtasks, 100 verified worker profiles, 10 clients, 20 jobs
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// High-value microtasks data
const HIGH_VALUE_MICROTASKS = [
  // DevOps (10 tasks)
  { title: 'CI/CD Pipeline Fix', category: 'DevOps', complexity: 'intermediate', delivery_window: '6-24h', base_price_min: 5000, base_price_max: 15000, commission: 8 },
  { title: 'Dockerfile Optimization', category: 'DevOps', complexity: 'intermediate', delivery_window: '6-24h', base_price_min: 3000, base_price_max: 8000, commission: 8 },
  { title: 'Kubernetes Deployment Patch', category: 'DevOps', complexity: 'advanced', delivery_window: '3-7d', base_price_min: 10000, base_price_max: 25000, commission: 8 },
  { title: 'Terraform Module Update', category: 'DevOps', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 8000, base_price_max: 20000, commission: 8 },
  { title: 'Jenkins Pipeline Debug', category: 'DevOps', complexity: 'intermediate', delivery_window: '6-24h', base_price_min: 5000, base_price_max: 12000, commission: 8 },
  { title: 'GitLab CI/CD Configuration', category: 'DevOps', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 6000, base_price_max: 15000, commission: 8 },
  { title: 'Ansible Playbook Fix', category: 'DevOps', complexity: 'advanced', delivery_window: '3-7d', base_price_min: 8000, base_price_max: 20000, commission: 8 },
  { title: 'AWS CloudFormation Template', category: 'DevOps', complexity: 'advanced', delivery_window: '3-7d', base_price_min: 10000, base_price_max: 25000, commission: 8 },
  { title: 'Monitoring Setup (Prometheus/Grafana)', category: 'DevOps', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 15000, base_price_max: 40000, commission: 8 },
  { title: 'Infrastructure Security Audit', category: 'DevOps', complexity: 'expert', delivery_window: '1-4w', base_price_min: 20000, base_price_max: 50000, commission: 8 },
  
  // Cloud (8 tasks)
  { title: 'AWS EC2 Security Configuration', category: 'Cloud', complexity: 'intermediate', delivery_window: '6-24h', base_price_min: 5000, base_price_max: 12000, commission: 8 },
  { title: 'Azure Resource Group Setup', category: 'Cloud', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 8000, base_price_max: 20000, commission: 8 },
  { title: 'GCP IAM Policy Review', category: 'Cloud', complexity: 'advanced', delivery_window: '3-7d', base_price_min: 10000, base_price_max: 25000, commission: 8 },
  { title: 'AWS S3 Bucket Security Fix', category: 'Cloud', complexity: 'intermediate', delivery_window: '6-24h', base_price_min: 4000, base_price_max: 10000, commission: 8 },
  { title: 'Cloud Cost Optimization Analysis', category: 'Cloud', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 15000, base_price_max: 40000, commission: 8 },
  { title: 'Multi-Region Deployment Setup', category: 'Cloud', complexity: 'expert', delivery_window: '1-4w', base_price_min: 25000, base_price_max: 60000, commission: 8 },
  { title: 'Cloud Backup Strategy Implementation', category: 'Cloud', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 12000, base_price_max: 30000, commission: 8 },
  { title: 'Serverless Function Optimization', category: 'Cloud', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 6000, base_price_max: 15000, commission: 8 },
  
  // Networking (6 tasks)
  { title: 'Network Security Configuration', category: 'Networking', complexity: 'advanced', delivery_window: '3-7d', base_price_min: 10000, base_price_max: 25000, commission: 8 },
  { title: 'VPN Setup and Configuration', category: 'Networking', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 8000, base_price_max: 20000, commission: 8 },
  { title: 'Load Balancer Configuration', category: 'Networking', complexity: 'advanced', delivery_window: '3-7d', base_price_min: 12000, base_price_max: 30000, commission: 8 },
  { title: 'DNS Migration and Optimization', category: 'Networking', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 6000, base_price_max: 15000, commission: 8 },
  { title: 'Network Performance Tuning', category: 'Networking', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 15000, base_price_max: 40000, commission: 8 },
  { title: 'Firewall Rule Audit and Update', category: 'Networking', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 8000, base_price_max: 20000, commission: 8 },
  
  // Python (8 tasks)
  { title: 'Python Automation Script', category: 'Python', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 8000, base_price_max: 20000, commission: 8 },
  { title: 'Django Performance Optimization', category: 'Python', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 15000, base_price_max: 40000, commission: 8 },
  { title: 'FastAPI Microservice Development', category: 'Python', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 20000, base_price_max: 50000, commission: 8 },
  { title: 'Data Pipeline with Pandas', category: 'Python', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 10000, base_price_max: 25000, commission: 8 },
  { title: 'Python API Integration', category: 'Python', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 8000, base_price_max: 20000, commission: 8 },
  { title: 'Machine Learning Model Deployment', category: 'Python', complexity: 'expert', delivery_window: '1-4w', base_price_min: 30000, base_price_max: 80000, commission: 8 },
  { title: 'Python Code Review and Refactoring', category: 'Python', complexity: 'advanced', delivery_window: '3-7d', base_price_min: 12000, base_price_max: 30000, commission: 8 },
  { title: 'Async Python Performance Fix', category: 'Python', complexity: 'advanced', delivery_window: '3-7d', base_price_min: 10000, base_price_max: 25000, commission: 8 },
  
  // Data Engineering (6 tasks)
  { title: 'ETL Pipeline Optimization', category: 'Data Engineering', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 20000, base_price_max: 50000, commission: 8 },
  { title: 'Database Query Optimization', category: 'Data Engineering', complexity: 'advanced', delivery_window: '3-7d', base_price_min: 12000, base_price_max: 30000, commission: 8 },
  { title: 'Data Warehouse Schema Design', category: 'Data Engineering', complexity: 'expert', delivery_window: '1-4w', base_price_min: 25000, base_price_max: 60000, commission: 8 },
  { title: 'Real-time Data Streaming Setup', category: 'Data Engineering', complexity: 'expert', delivery_window: '1-4w', base_price_min: 30000, base_price_max: 80000, commission: 8 },
  { title: 'Data Quality Validation Script', category: 'Data Engineering', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 10000, base_price_max: 25000, commission: 8 },
  { title: 'Big Data Processing Optimization', category: 'Data Engineering', complexity: 'expert', delivery_window: '1-4w', base_price_min: 35000, base_price_max: 90000, commission: 8 },
  
  // AI/LLM (6 tasks)
  { title: 'AI RAG Pipeline Setup', category: 'AI/LLM', complexity: 'expert', delivery_window: '1-4w', base_price_min: 40000, base_price_max: 100000, commission: 8 },
  { title: 'LLM Fine-tuning Script', category: 'AI/LLM', complexity: 'expert', delivery_window: '1-4w', base_price_min: 50000, base_price_max: 120000, commission: 8 },
  { title: 'Vector Database Integration', category: 'AI/LLM', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 25000, base_price_max: 60000, commission: 8 },
  { title: 'AI Model API Wrapper', category: 'AI/LLM', complexity: 'advanced', delivery_window: '3-7d', base_price_min: 20000, base_price_max: 50000, commission: 8 },
  { title: 'Prompt Engineering Optimization', category: 'AI/LLM', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 15000, base_price_max: 40000, commission: 8 },
  { title: 'AI Chatbot Integration', category: 'AI/LLM', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 30000, base_price_max: 80000, commission: 8 },
  
  // Backend (6 tasks)
  { title: 'API Rate Limiting Implementation', category: 'Backend', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 8000, base_price_max: 20000, commission: 8 },
  { title: 'Microservices Communication Setup', category: 'Backend', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 25000, base_price_max: 60000, commission: 8 },
  { title: 'Database Migration Script', category: 'Backend', complexity: 'intermediate', delivery_window: '3-7d', base_price_min: 10000, base_price_max: 25000, commission: 8 },
  { title: 'Caching Strategy Implementation', category: 'Backend', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 20000, base_price_max: 50000, commission: 8 },
  { title: 'GraphQL API Development', category: 'Backend', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 30000, base_price_max: 80000, commission: 8 },
  { title: 'WebSocket Real-time Feature', category: 'Backend', complexity: 'advanced', delivery_window: '1-4w', base_price_min: 25000, base_price_max: 60000, commission: 8 }
]

async function seedHighValueMicrotasks() {
  console.log('🌱 Seeding high-value microtasks...')
  
  // First, get or create categories
  const categoryMap: Record<string, string> = {}
  
  for (const task of HIGH_VALUE_MICROTASKS) {
    if (!categoryMap[task.category]) {
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', task.category.toLowerCase().replace(/\s+/g, '-'))
        .single()
      
      if (existing) {
        categoryMap[task.category] = existing.id
      } else {
        const { data: newCat, error } = await supabase
          .from('categories')
          .insert({
            slug: task.category.toLowerCase().replace(/\s+/g, '-'),
            name: task.category,
            description: `${task.category} high-value microtasks`,
            is_active: true
          })
          .select('id')
          .single()
        
        if (error) {
          console.error(`Error creating category ${task.category}:`, error)
          continue
        }
        categoryMap[task.category] = newCat.id
      }
    }
    
    const slug = task.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    const { error } = await supabase
      .from('microtasks')
      .upsert({
        title: task.title,
        slug: slug,
        description: `High-value ${task.title.toLowerCase()} microtask. Professional expertise required.`,
        category_id: categoryMap[task.category],
        complexity: task.complexity,
        delivery_window: task.delivery_window,
        base_price_min: task.base_price_min * 100, // Convert to paise
        base_price_max: task.base_price_max * 100,
        default_commission_percent: task.commission
      }, {
        onConflict: 'slug'
      })
    
    if (error) {
      console.error(`Error seeding microtask ${task.title}:`, error)
    }
  }
  
  console.log(`✅ Seeded ${HIGH_VALUE_MICROTASKS.length} high-value microtasks`)
}

async function seedWorkers() {
  console.log('👥 Seeding verified worker profiles...')
  
  const skills = [
    ['CI/CD', 'Docker', 'Kubernetes', 'Terraform', 'AWS'],
    ['Python', 'Django', 'FastAPI', 'PostgreSQL'],
    ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    ['AWS', 'Azure', 'GCP', 'CloudFormation'],
    ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch'],
    ['DevOps', 'Jenkins', 'GitLab CI', 'Ansible'],
    ['Networking', 'VPN', 'Load Balancing', 'DNS'],
    ['Data Engineering', 'ETL', 'Spark', 'Kafka'],
    ['AI/LLM', 'RAG', 'Vector DB', 'OpenAI'],
    ['Backend', 'Microservices', 'GraphQL', 'Redis']
  ]
  
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh',
    'Anjali Mehta', 'Rohit Gupta', 'Kavita Nair', 'Suresh Iyer', 'Deepa Joshi'
  ]
  
  for (let i = 0; i < 100; i++) {
    const nameIndex = i % names.length
    const skillSet = skills[i % skills.length]
    const verifiedLevel = i < 30 ? 'basic' : i < 70 ? 'professional' : 'premium'
    const score = 75 + Math.floor(Math.random() * 25) // 75-100
    
    // Create user
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: `worker${i + 1}@demo.2ndshift.in`,
      password: 'DemoWorker123!',
      email_confirm: true
    })
    
    if (userError || !user.user) {
      console.error(`Error creating user ${i + 1}:`, userError)
      continue
    }
    
    // Create user record
    const { error: userRecordError } = await supabase
      .from('users')
      .insert({
        id: user.user.id,
        email: user.user.email,
        full_name: `${names[nameIndex]} ${i > 9 ? i : ''}`,
        user_type: 'worker',
        email_verified: true
      })
    
    if (userRecordError) {
      console.error(`Error creating user record ${i + 1}:`, userRecordError)
      continue
    }
    
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.user.id,
        headline: `Senior ${skillSet[0]} Developer`,
        bio: `Experienced ${skillSet.join(', ')} specialist with ${5 + Math.floor(Math.random() * 10)} years of experience.`,
        skills: skillSet,
        verified_level: verifiedLevel,
        score: score,
        hourly_rate_min: (800 + Math.floor(Math.random() * 400)) * 100,
        hourly_rate_max: (1500 + Math.floor(Math.random() * 1000)) * 100,
        availability: {
          hours_per_week: 20 + Math.floor(Math.random() * 30),
          timezone: 'Asia/Kolkata',
          open_to_work: true
        },
        portfolio_links: [`https://portfolio-${i + 1}.example.com`]
      })
    
    if (profileError) {
      console.error(`Error creating profile ${i + 1}:`, profileError)
    }
    
    // Create worker availability
    await supabase
      .from('worker_availability')
      .insert({
        user_id: user.user.id,
        open_to_work: true,
        priority_tier: i < 20 ? 'elite' : i < 50 ? 'priority' : 'standard',
        availability: {
          hours_per_week: 20 + Math.floor(Math.random() * 30),
          timezone: 'Asia/Kolkata'
        }
      })
    
    // Create shift credits
    await supabase
      .from('shift_credits')
      .insert({
        user_id: user.user.id,
        balance: Math.floor(Math.random() * 100) + 10
      })
  }
  
  console.log('✅ Seeded 100 verified worker profiles')
}

async function seedClients() {
  console.log('🏢 Seeding demo clients...')
  
  const clientNames = [
    'TechStart Inc', 'CloudSolutions Ltd', 'DataDriven Corp', 'AI Innovations', 'DevOps Pro',
    'SecureNet Systems', 'ScaleUp Technologies', 'NextGen Apps', 'SmartCloud Services', 'InnovateHub'
  ]
  
  for (let i = 0; i < 10; i++) {
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: `client${i + 1}@demo.2ndshift.in`,
      password: 'DemoClient123!',
      email_confirm: true
    })
    
    if (userError || !user.user) {
      console.error(`Error creating client ${i + 1}:`, userError)
      continue
    }
    
    await supabase
      .from('users')
      .insert({
        id: user.user.id,
        email: user.user.email,
        full_name: clientNames[i],
        user_type: 'client',
        email_verified: true
      })
    
    await supabase
      .from('shift_credits')
      .insert({
        user_id: user.user.id,
        balance: 200
      })
  }
  
  console.log('✅ Seeded 10 demo clients')
}

async function seedJobs() {
  console.log('💼 Seeding demo jobs...')
  
  // Get client IDs
  const { data: clients } = await supabase
    .from('users')
    .select('id')
    .eq('user_type', 'client')
    .limit(10)
  
  if (!clients || clients.length === 0) {
    console.error('No clients found for job seeding')
    return
  }
  
  // Get microtasks
  const { data: microtasks } = await supabase
    .from('microtasks')
    .select('id, title')
    .limit(20)
  
  const jobTitles = [
    'CI/CD Pipeline Optimization Needed',
    'Docker Container Security Review',
    'Kubernetes Cluster Setup',
    'Python API Development',
    'AWS Infrastructure Migration',
    'Data Pipeline Optimization',
    'AI RAG System Implementation',
    'Microservices Architecture Design',
    'Database Performance Tuning',
    'Real-time Analytics Platform',
    'Cloud Security Audit',
    'DevOps Automation Script',
    'Machine Learning Model Deployment',
    'GraphQL API Development',
    'WebSocket Real-time Feature',
    'ETL Pipeline Development',
    'Vector Database Integration',
    'Network Security Configuration',
    'API Rate Limiting Implementation',
    'Caching Strategy Setup'
  ]
  
  const statuses: Array<'open' | 'assigned' | 'completed'> = ['open', 'assigned', 'completed']
  
  for (let i = 0; i < 20; i++) {
    const client = clients[i % clients.length]
    const microtask = microtasks?.[i % (microtasks.length || 1)]
    const isHardToFind = i % 5 === 0 // Every 5th job is hard to find
    
    const { error } = await supabase
      .from('jobs')
      .insert({
        client_id: client.id,
        title: jobTitles[i],
        description: `High-value ${jobTitles[i].toLowerCase()} project. Looking for experienced professional.`,
        microtask_id: microtask?.id,
        custom: !microtask,
        status: statuses[i % statuses.length],
        price_fixed: (10000 + Math.floor(Math.random() * 40000)) * 100,
        is_hard_to_find: isHardToFind,
        sourcing_status: isHardToFind ? 'sourcing_requested' : 'auto_match'
      })
    
    if (error) {
      console.error(`Error seeding job ${i + 1}:`, error)
    }
  }
  
  console.log('✅ Seeded 20 demo jobs')
}

async function main() {
  console.log('🚀 Starting high-value microtasks seed...\n')
  
  try {
    await seedHighValueMicrotasks()
    await seedWorkers()
    await seedClients()
    await seedJobs()
    
    console.log('\n✅ All seeding completed successfully!')
    console.log('\nSummary:')
    console.log('- Microtasks: 50')
    console.log('- Worker Profiles: 100')
    console.log('- Clients: 10')
    console.log('- Jobs: 20')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

main()
