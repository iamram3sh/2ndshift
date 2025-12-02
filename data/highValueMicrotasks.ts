/**
 * High-value microtasks across all 9 expert categories
 * These are curated, high-value tasks that showcase expertise and command premium rates
 */

import { PROGRAMMING_MICROTASKS } from './highValueProgrammingTasks'

export interface HighValueMicrotask {
  id: string
  title: string
  description: string
  category: 'devops' | 'cloud' | 'networking' | 'security' | 'ai' | 'data' | 'sre' | 'database' | 'programming'
  complexity: 'low' | 'medium' | 'high'
  price_min: number // INR
  price_max: number // INR
  default_commission_percent: number // 8-18%
  delivery_window: '6-24h' | '3-7d' | '1-4w'
  skills: string[]
}

// DevOps & CI/CD microtasks
const DEVOPS_MICROTASKS: HighValueMicrotask[] = [
  {
    id: 'devops-1',
    title: 'CI/CD Pipeline Fix',
    description: 'Debug and fix failing CI/CD pipeline. Identify root cause, fix build errors, optimize pipeline performance, and ensure reliable deployments.',
    category: 'devops',
    complexity: 'medium',
    price_min: 5000,
    price_max: 15000,
    default_commission_percent: 10,
    delivery_window: '3-7d',
    skills: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'Docker']
  },
  {
    id: 'devops-2',
    title: 'Dockerfile Optimization',
    description: 'Optimize Dockerfile for smaller image size, faster builds, and better security. Implement multi-stage builds, layer caching, and security best practices.',
    category: 'devops',
    complexity: 'medium',
    price_min: 4000,
    price_max: 12000,
    default_commission_percent: 10,
    delivery_window: '3-7d',
    skills: ['Docker', 'Containerization', 'Security']
  },
  {
    id: 'devops-3',
    title: 'Kubernetes Deployment Patch',
    description: 'Fix Kubernetes deployment issues, optimize resource allocation, implement health checks, and ensure high availability.',
    category: 'devops',
    complexity: 'high',
    price_min: 10000,
    price_max: 25000,
    default_commission_percent: 12,
    delivery_window: '3-7d',
    skills: ['Kubernetes', 'Helm', 'YAML', 'Container Orchestration']
  },
  {
    id: 'devops-4',
    title: 'Infrastructure as Code (Terraform/Ansible)',
    description: 'Create or update IaC modules for infrastructure provisioning. Implement best practices, add validation, and ensure idempotency.',
    category: 'devops',
    complexity: 'high',
    price_min: 12000,
    price_max: 30000,
    default_commission_percent: 12,
    delivery_window: '1-4w',
    skills: ['Terraform', 'Ansible', 'CloudFormation', 'IaC']
  },
  {
    id: 'devops-5',
    title: 'Automated Testing Pipeline Setup',
    description: 'Set up comprehensive automated testing pipeline with unit, integration, and E2E tests. Configure test reporting and coverage tracking.',
    category: 'devops',
    complexity: 'medium',
    price_min: 8000,
    price_max: 20000,
    default_commission_percent: 10,
    delivery_window: '1-4w',
    skills: ['Testing', 'CI/CD', 'Test Automation']
  }
]

// Cloud Engineering microtasks
const CLOUD_MICROTASKS: HighValueMicrotask[] = [
  {
    id: 'cloud-1',
    title: 'AWS Security Audit',
    description: 'Conduct comprehensive AWS security audit. Review IAM policies, S3 bucket permissions, VPC configurations, and identify security vulnerabilities.',
    category: 'cloud',
    complexity: 'high',
    price_min: 15000,
    price_max: 35000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['AWS', 'Security', 'IAM', 'Cloud Security']
  },
  {
    id: 'cloud-2',
    title: 'Cloud Cost Optimization',
    description: 'Analyze cloud spending and optimize costs. Right-size instances, implement auto-scaling, optimize storage, and reduce unnecessary expenses.',
    category: 'cloud',
    complexity: 'high',
    price_min: 12000,
    price_max: 30000,
    default_commission_percent: 12,
    delivery_window: '1-4w',
    skills: ['AWS', 'Azure', 'GCP', 'Cost Optimization']
  },
  {
    id: 'cloud-3',
    title: 'Serverless Architecture Implementation',
    description: 'Design and implement serverless architecture using Lambda, API Gateway, and related services. Optimize for cost and performance.',
    category: 'cloud',
    complexity: 'high',
    price_min: 20000,
    price_max: 50000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['AWS Lambda', 'Serverless', 'API Gateway', 'Cloud Functions']
  },
  {
    id: 'cloud-4',
    title: 'Multi-Cloud Migration Strategy',
    description: 'Design migration strategy for moving workloads between cloud providers. Plan data migration, network setup, and cutover procedures.',
    category: 'cloud',
    complexity: 'high',
    price_min: 25000,
    price_max: 60000,
    default_commission_percent: 18,
    delivery_window: '1-4w',
    skills: ['AWS', 'Azure', 'GCP', 'Migration']
  },
  {
    id: 'cloud-5',
    title: 'Cloud Disaster Recovery Setup',
    description: 'Design and implement disaster recovery solution. Set up backup strategies, replication, and automated failover procedures.',
    category: 'cloud',
    complexity: 'high',
    price_min: 18000,
    price_max: 40000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['AWS', 'Disaster Recovery', 'Backup', 'High Availability']
  }
]

// Networking microtasks
const NETWORKING_MICROTASKS: HighValueMicrotask[] = [
  {
    id: 'networking-1',
    title: 'Network Architecture Design',
    description: 'Design scalable network architecture for cloud or on-premises. Plan subnets, routing, load balancing, and security zones.',
    category: 'networking',
    complexity: 'high',
    price_min: 20000,
    price_max: 50000,
    default_commission_percent: 18,
    delivery_window: '1-4w',
    skills: ['Network Design', 'VPC', 'Routing', 'Load Balancing']
  },
  {
    id: 'networking-2',
    title: 'VPN Infrastructure Setup',
    description: 'Set up secure VPN infrastructure for remote access. Configure site-to-site and client VPNs with proper security policies.',
    category: 'networking',
    complexity: 'high',
    price_min: 15000,
    price_max: 35000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['VPN', 'Network Security', 'IPSec', 'OpenVPN']
  },
  {
    id: 'networking-3',
    title: 'Load Balancer Configuration',
    description: 'Configure and optimize load balancers for high availability and performance. Set up health checks, SSL termination, and routing rules.',
    category: 'networking',
    complexity: 'medium',
    price_min: 10000,
    price_max: 25000,
    default_commission_percent: 12,
    delivery_window: '3-7d',
    skills: ['Load Balancing', 'NGINX', 'HAProxy', 'AWS ELB']
  },
  {
    id: 'networking-4',
    title: 'Network Performance Optimization',
    description: 'Analyze and optimize network performance. Identify bottlenecks, optimize routing, implement QoS, and improve latency.',
    category: 'networking',
    complexity: 'high',
    price_min: 18000,
    price_max: 40000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['Network Optimization', 'Performance Tuning', 'QoS']
  }
]

// Security microtasks
const SECURITY_MICROTASKS: HighValueMicrotask[] = [
  {
    id: 'security-1',
    title: 'Security Audit & Penetration Testing',
    description: 'Conduct comprehensive security audit and penetration testing. Identify vulnerabilities, test defenses, and provide remediation recommendations.',
    category: 'security',
    complexity: 'high',
    price_min: 25000,
    price_max: 60000,
    default_commission_percent: 18,
    delivery_window: '1-4w',
    skills: ['Penetration Testing', 'Security Audit', 'OWASP', 'Vulnerability Assessment']
  },
  {
    id: 'security-2',
    title: 'Compliance Implementation (SOC2/ISO27001)',
    description: 'Implement security controls and processes for compliance. Document policies, implement controls, and prepare for audit.',
    category: 'security',
    complexity: 'high',
    price_min: 30000,
    price_max: 80000,
    default_commission_percent: 18,
    delivery_window: '1-4w',
    skills: ['SOC2', 'ISO27001', 'Compliance', 'Security Controls']
  },
  {
    id: 'security-3',
    title: 'Infrastructure Hardening',
    description: 'Harden infrastructure security. Implement security best practices, configure firewalls, disable unnecessary services, and apply patches.',
    category: 'security',
    complexity: 'high',
    price_min: 15000,
    price_max: 35000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['Security Hardening', 'Firewall', 'System Security']
  },
  {
    id: 'security-4',
    title: 'Security Incident Response Plan',
    description: 'Develop comprehensive security incident response plan. Define procedures, roles, communication plans, and recovery steps.',
    category: 'security',
    complexity: 'medium',
    price_min: 12000,
    price_max: 30000,
    default_commission_percent: 12,
    delivery_window: '1-4w',
    skills: ['Incident Response', 'Security Planning', 'Risk Management']
  }
]

// AI/LLM microtasks
const AI_MICROTASKS: HighValueMicrotask[] = [
  {
    id: 'ai-1',
    title: 'RAG Pipeline Setup',
    description: 'Set up Retrieval-Augmented Generation pipeline. Integrate vector database, implement retrieval logic, and optimize for performance.',
    category: 'ai',
    complexity: 'high',
    price_min: 25000,
    price_max: 60000,
    default_commission_percent: 18,
    delivery_window: '1-4w',
    skills: ['RAG', 'Vector Databases', 'LLM', 'Embeddings']
  },
  {
    id: 'ai-2',
    title: 'LLM Fine-tuning',
    description: 'Fine-tune large language model for specific use case. Prepare training data, configure training, and optimize model performance.',
    category: 'ai',
    complexity: 'high',
    price_min: 30000,
    price_max: 80000,
    default_commission_percent: 18,
    delivery_window: '1-4w',
    skills: ['LLM', 'Fine-tuning', 'Machine Learning', 'PyTorch']
  },
  {
    id: 'ai-3',
    title: 'Vector Database Integration',
    description: 'Integrate vector database for semantic search. Set up embeddings, implement similarity search, and optimize query performance.',
    category: 'ai',
    complexity: 'high',
    price_min: 20000,
    price_max: 50000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['Vector Databases', 'Pinecone', 'Weaviate', 'Embeddings']
  },
  {
    id: 'ai-4',
    title: 'AI Model Deployment & Optimization',
    description: 'Deploy AI model to production. Optimize inference speed, implement caching, and ensure scalability.',
    category: 'ai',
    complexity: 'high',
    price_min: 25000,
    price_max: 60000,
    default_commission_percent: 18,
    delivery_window: '1-4w',
    skills: ['Model Deployment', 'MLOps', 'Optimization', 'Inference']
  }
]

// Data Engineering microtasks
const DATA_MICROTASKS: HighValueMicrotask[] = [
  {
    id: 'data-1',
    title: 'ETL Pipeline Optimization',
    description: 'Optimize ETL pipeline for performance and reliability. Improve data processing speed, handle errors, and ensure data quality.',
    category: 'data',
    complexity: 'high',
    price_min: 20000,
    price_max: 50000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['ETL', 'Data Pipeline', 'Apache Airflow', 'Data Processing']
  },
  {
    id: 'data-2',
    title: 'Data Warehouse Design',
    description: 'Design scalable data warehouse architecture. Plan schema, implement ETL processes, and optimize for query performance.',
    category: 'data',
    complexity: 'high',
    price_min: 30000,
    price_max: 80000,
    default_commission_percent: 18,
    delivery_window: '1-4w',
    skills: ['Data Warehouse', 'Snowflake', 'BigQuery', 'Data Modeling']
  },
  {
    id: 'data-3',
    title: 'Real-time Streaming Pipeline',
    description: 'Implement real-time data streaming pipeline. Set up Kafka/Kinesis, process streams, and ensure low latency.',
    category: 'data',
    complexity: 'high',
    price_min: 25000,
    price_max: 60000,
    default_commission_percent: 18,
    delivery_window: '1-4w',
    skills: ['Kafka', 'Streaming', 'Real-time Processing', 'Data Streaming']
  },
  {
    id: 'data-4',
    title: 'Big Data Processing Optimization',
    description: 'Optimize big data processing jobs. Improve Spark performance, optimize data partitioning, and reduce processing time.',
    category: 'data',
    complexity: 'high',
    price_min: 20000,
    price_max: 50000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['Spark', 'Big Data', 'Hadoop', 'Data Processing']
  }
]

// SRE microtasks
const SRE_MICROTASKS: HighValueMicrotask[] = [
  {
    id: 'sre-1',
    title: 'Monitoring & Observability Setup',
    description: 'Set up comprehensive monitoring and observability. Configure Prometheus, Grafana, implement alerts, and create dashboards.',
    category: 'sre',
    complexity: 'high',
    price_min: 20000,
    price_max: 50000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['Prometheus', 'Grafana', 'Monitoring', 'Observability']
  },
  {
    id: 'sre-2',
    title: 'Incident Response Automation',
    description: 'Automate incident response procedures. Implement runbooks, automated remediation, and escalation workflows.',
    category: 'sre',
    complexity: 'high',
    price_min: 18000,
    price_max: 40000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['Incident Response', 'Automation', 'SRE', 'Runbooks']
  },
  {
    id: 'sre-3',
    title: 'Service Reliability Improvement',
    description: 'Improve service reliability and uptime. Implement circuit breakers, retries, timeouts, and graceful degradation.',
    category: 'sre',
    complexity: 'high',
    price_min: 20000,
    price_max: 50000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['Reliability', 'Resilience', 'Circuit Breakers', 'SRE']
  },
  {
    id: 'sre-4',
    title: 'Performance & Capacity Planning',
    description: 'Analyze system performance and plan capacity. Identify bottlenecks, forecast growth, and recommend scaling strategies.',
    category: 'sre',
    complexity: 'high',
    price_min: 18000,
    price_max: 40000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['Performance', 'Capacity Planning', 'Scaling', 'SRE']
  }
]

// Database microtasks
const DATABASE_MICROTASKS: HighValueMicrotask[] = [
  {
    id: 'database-1',
    title: 'Database Query Optimization',
    description: 'Optimize slow database queries. Analyze query plans, add indexes, rewrite queries, and improve performance.',
    category: 'database',
    complexity: 'high',
    price_min: 12000,
    price_max: 30000,
    default_commission_percent: 12,
    delivery_window: '3-7d',
    skills: ['PostgreSQL', 'MySQL', 'Query Optimization', 'Indexing']
  },
  {
    id: 'database-2',
    title: 'Database Migration Strategy',
    description: 'Plan and execute database migration. Design migration strategy, handle data migration, and ensure zero downtime.',
    category: 'database',
    complexity: 'high',
    price_min: 25000,
    price_max: 60000,
    default_commission_percent: 18,
    delivery_window: '1-4w',
    skills: ['Database Migration', 'PostgreSQL', 'MySQL', 'Data Migration']
  },
  {
    id: 'database-3',
    title: 'Database Replication Setup',
    description: 'Set up database replication for high availability. Configure master-slave replication, implement failover, and ensure data consistency.',
    category: 'database',
    complexity: 'high',
    price_min: 18000,
    price_max: 40000,
    default_commission_percent: 15,
    delivery_window: '1-4w',
    skills: ['Database Replication', 'High Availability', 'PostgreSQL', 'MySQL']
  },
  {
    id: 'database-4',
    title: 'Database Backup & Recovery',
    description: 'Design and implement database backup and recovery strategy. Set up automated backups, test recovery procedures, and ensure RPO/RTO.',
    category: 'database',
    complexity: 'medium',
    price_min: 10000,
    price_max: 25000,
    default_commission_percent: 12,
    delivery_window: '1-4w',
    skills: ['Backup', 'Recovery', 'Database', 'Disaster Recovery']
  }
]

// Convert Programming microtasks to HighValueMicrotask format
const PROGRAMMING_HIGH_VALUE: HighValueMicrotask[] = PROGRAMMING_MICROTASKS.map((task, index) => ({
  id: `programming-${index + 1}`,
  title: task.title,
  description: task.description,
  category: 'programming' as const,
  complexity: task.complexity,
  price_min: task.price_min,
  price_max: task.price_max,
  default_commission_percent: task.default_commission_percent,
  delivery_window: task.delivery_window,
  skills: extractSkillsFromTitle(task.title)
}))

// Helper to extract skills from task title
function extractSkillsFromTitle(title: string): string[] {
  const skills: string[] = []
  const skillKeywords: Record<string, string[]> = {
    'Java': ['Java'],
    'Python': ['Python'],
    'Golang': ['Golang', 'Go'],
    'Node.js': ['Node.js', 'Node'],
    'Rust': ['Rust'],
    'C++': ['C++'],
    'TypeScript': ['TypeScript', 'TS'],
    'Kafka': ['Kafka'],
    'gRPC': ['gRPC'],
    'NestJS': ['NestJS'],
    'Express': ['Express'],
    'FastAPI': ['FastAPI'],
    'Kong': ['Kong'],
    'NGINX': ['NGINX'],
    'Traefik': ['Traefik']
  }
  
  for (const [skill, keywords] of Object.entries(skillKeywords)) {
    if (keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
      skills.push(skill)
    }
  }
  
  // Default skills if none found
  if (skills.length === 0) {
    skills.push('Backend Development', 'API Development')
  }
  
  return skills
}

// Combine all microtasks
export const HIGH_VALUE_MICROTASKS: HighValueMicrotask[] = [
  ...DEVOPS_MICROTASKS,
  ...CLOUD_MICROTASKS,
  ...NETWORKING_MICROTASKS,
  ...SECURITY_MICROTASKS,
  ...AI_MICROTASKS,
  ...DATA_MICROTASKS,
  ...SRE_MICROTASKS,
  ...DATABASE_MICROTASKS,
  ...PROGRAMMING_HIGH_VALUE
]

// Helper functions
export function getMicrotasksByCategory(category: HighValueMicrotask['category']): HighValueMicrotask[] {
  return HIGH_VALUE_MICROTASKS.filter(task => task.category === category)
}

export function getMicrotasksByComplexity(complexity: HighValueMicrotask['complexity']): HighValueMicrotask[] {
  return HIGH_VALUE_MICROTASKS.filter(task => task.complexity === complexity)
}

export function getMicrotaskById(id: string): HighValueMicrotask | undefined {
  return HIGH_VALUE_MICROTASKS.find(task => task.id === id)
}
