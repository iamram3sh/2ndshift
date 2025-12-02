/**
 * High-value expert categories for 2ndShift platform
 * These are the premium categories that require senior-level expertise
 */

import { Code, Cloud, Network, Shield, Brain, Database, Activity, HardDrive, Server } from 'lucide-react'

export interface HighValueCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: typeof Code
  example: string
  priceRange: string
  displayOrder: number
}

export const HIGH_VALUE_CATEGORIES: HighValueCategory[] = [
  {
    id: 'devops',
    name: 'DevOps & CI/CD',
    slug: 'devops',
    description: 'CI/CD pipelines, infrastructure automation, containerization, and deployment strategies',
    icon: Activity,
    example: 'CI/CD pipeline fix',
    priceRange: 'From ₹5,000',
    displayOrder: 1
  },
  {
    id: 'cloud',
    name: 'Cloud Engineering',
    slug: 'cloud',
    description: 'AWS, Azure, GCP infrastructure, serverless, and cloud-native solutions',
    icon: Cloud,
    example: 'AWS security audit',
    priceRange: 'From ₹8,000',
    displayOrder: 2
  },
  {
    id: 'networking',
    name: 'High-End Networking',
    slug: 'networking',
    description: 'Network architecture, security, VPN, load balancing, and infrastructure optimization',
    icon: Network,
    example: 'Network migration',
    priceRange: 'From ₹10,000',
    displayOrder: 3
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    slug: 'security',
    description: 'Security audits, penetration testing, compliance, and infrastructure hardening',
    icon: Shield,
    example: 'Security audit',
    priceRange: 'From ₹12,000',
    displayOrder: 4
  },
  {
    id: 'ai',
    name: 'AI / LLM Engineering',
    slug: 'ai',
    description: 'LLM fine-tuning, RAG pipelines, vector databases, and AI model deployment',
    icon: Brain,
    example: 'AI RAG setup',
    priceRange: 'From ₹15,000',
    displayOrder: 5
  },
  {
    id: 'data',
    name: 'Data Engineering',
    slug: 'data',
    description: 'ETL pipelines, data warehousing, real-time streaming, and big data processing',
    icon: Database,
    example: 'ETL optimization',
    priceRange: 'From ₹12,000',
    displayOrder: 6
  },
  {
    id: 'sre',
    name: 'SRE & Observability',
    slug: 'sre',
    description: 'Site reliability, monitoring, alerting, incident response, and system observability',
    icon: Activity,
    example: 'Monitoring setup',
    priceRange: 'From ₹10,000',
    displayOrder: 7
  },
  {
    id: 'db',
    name: 'Database & Storage',
    slug: 'database',
    description: 'Database optimization, migrations, replication, and storage architecture',
    icon: HardDrive,
    example: 'DB query optimization',
    priceRange: 'From ₹8,000',
    displayOrder: 8
  },
  {
    id: 'programming',
    name: 'Senior Backend & Systems Programming',
    slug: 'programming',
    description: 'Complex backend, API performance, architecture, concurrency, migrations, and production-critical programming',
    icon: Server,
    example: 'API memory leak fix',
    priceRange: 'From ₹4,000',
    displayOrder: 9
  }
]

export const getCategoryBySlug = (slug: string): HighValueCategory | undefined => {
  return HIGH_VALUE_CATEGORIES.find(cat => cat.slug === slug)
}

export const getCategoryById = (id: string): HighValueCategory | undefined => {
  return HIGH_VALUE_CATEGORIES.find(cat => cat.id === id)
}
