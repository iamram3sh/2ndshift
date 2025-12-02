/**
 * High-value Programming microtasks
 * Senior Backend & Systems Programming category
 * Complex backend, API, performance, architecture, concurrency, migrations, and production-critical tasks
 */

export interface ProgrammingMicrotask {
  title: string
  description: string
  category: 'programming'
  complexity: 'low' | 'medium' | 'high'
  price_min: number // INR
  price_max: number // INR
  default_commission_percent: number // 8-18%
  delivery_window: '6-24h' | '3-7d' | '1-4w'
}

export const PROGRAMMING_MICROTASKS: ProgrammingMicrotask[] = [
  {
    title: 'API Memory Leak Debugging',
    description: 'Identify and fix memory leaks in production API services. Analyze heap dumps, profile memory usage, and implement fixes for memory leaks causing service degradation.',
    category: 'programming',
    complexity: 'high',
    price_min: 8000,
    price_max: 20000,
    default_commission_percent: 12,
    delivery_window: '3-7d'
  },
  {
    title: 'High-Performance Backend Tuning (Java/Golang/Python)',
    description: 'Optimize backend service performance for high-throughput scenarios. Profile bottlenecks, optimize database queries, improve concurrency handling, and achieve target latency/throughput.',
    category: 'programming',
    complexity: 'high',
    price_min: 12000,
    price_max: 30000,
    default_commission_percent: 15,
    delivery_window: '1-4w'
  },
  {
    title: 'Concurrency / Thread-Safety Fix',
    description: 'Fix race conditions, deadlocks, and thread-safety issues in multi-threaded applications. Implement proper synchronization, use concurrent data structures, and ensure thread-safe operations.',
    category: 'programming',
    complexity: 'high',
    price_min: 10000,
    price_max: 25000,
    default_commission_percent: 15,
    delivery_window: '3-7d'
  },
  {
    title: 'Legacy Monolith → Microservices Refactor (Module Extraction)',
    description: 'Extract a module from a legacy monolith into a microservice. Design service boundaries, implement API contracts, handle data migration, and ensure backward compatibility.',
    category: 'programming',
    complexity: 'high',
    price_min: 25000,
    price_max: 60000,
    default_commission_percent: 18,
    delivery_window: '1-4w'
  },
  {
    title: 'Distributed Systems Debugging (Kafka, gRPC, Queues)',
    description: 'Debug issues in distributed systems using Kafka, gRPC, message queues. Fix message ordering, handle failures, implement retries, and ensure eventual consistency.',
    category: 'programming',
    complexity: 'high',
    price_min: 15000,
    price_max: 35000,
    default_commission_percent: 15,
    delivery_window: '1-4w'
  },
  {
    title: 'Database/ORM Performance Bottleneck Fix',
    description: 'Identify and fix database/ORM performance issues. Optimize N+1 queries, add proper indexes, implement query caching, and optimize database access patterns.',
    category: 'programming',
    complexity: 'high',
    price_min: 10000,
    price_max: 25000,
    default_commission_percent: 12,
    delivery_window: '3-7d'
  },
  {
    title: 'Production Crash / Core Dump Analysis',
    description: 'Analyze production crashes and core dumps. Identify root cause, fix memory corruption, null pointer exceptions, or segmentation faults causing service crashes.',
    category: 'programming',
    complexity: 'high',
    price_min: 12000,
    price_max: 30000,
    default_commission_percent: 15,
    delivery_window: '3-7d'
  },
  {
    title: 'High-Load API Scalability Tuning',
    description: 'Optimize API for high-load scenarios. Implement connection pooling, optimize serialization, add caching layers, and tune server configurations for maximum throughput.',
    category: 'programming',
    complexity: 'high',
    price_min: 15000,
    price_max: 40000,
    default_commission_percent: 15,
    delivery_window: '1-4w'
  },
  {
    title: 'Auth/Security Hardening for Backend Services',
    description: 'Implement security hardening for backend services. Add rate limiting, implement proper authentication/authorization, fix security vulnerabilities, and add security headers.',
    category: 'programming',
    complexity: 'high',
    price_min: 12000,
    price_max: 30000,
    default_commission_percent: 12,
    delivery_window: '3-7d'
  },
  {
    title: 'CI Pipeline Failure due to Code-Level Issue',
    description: 'Debug and fix CI/CD pipeline failures caused by code issues. Fix test failures, resolve dependency conflicts, fix build errors, and ensure pipeline stability.',
    category: 'programming',
    complexity: 'medium',
    price_min: 6000,
    price_max: 15000,
    default_commission_percent: 10,
    delivery_window: '6-24h'
  },
  {
    title: 'Middleware Performance Debugging',
    description: 'Debug and optimize middleware performance. Profile middleware execution, identify bottlenecks, optimize request/response processing, and improve overall latency.',
    category: 'programming',
    complexity: 'high',
    price_min: 10000,
    price_max: 25000,
    default_commission_percent: 12,
    delivery_window: '3-7d'
  },
  {
    title: 'API Gateway Optimization (Kong/NGINX/Traefik)',
    description: 'Optimize API gateway configuration and performance. Tune routing rules, implement caching strategies, optimize load balancing, and improve gateway throughput.',
    category: 'programming',
    complexity: 'high',
    price_min: 12000,
    price_max: 30000,
    default_commission_percent: 12,
    delivery_window: '3-7d'
  },
  {
    title: 'Rust/Golang Backend Module Implementation',
    description: 'Implement a backend module in Rust or Golang. Design API, implement business logic, add tests, and ensure performance and memory safety.',
    category: 'programming',
    complexity: 'high',
    price_min: 15000,
    price_max: 40000,
    default_commission_percent: 15,
    delivery_window: '1-4w'
  },
  {
    title: 'Rate Limiting / Caching Layer Implementation',
    description: 'Implement rate limiting and caching layers for APIs. Design rate limiting strategies, implement distributed caching, handle cache invalidation, and optimize cache hit rates.',
    category: 'programming',
    complexity: 'medium',
    price_min: 8000,
    price_max: 20000,
    default_commission_percent: 10,
    delivery_window: '3-7d'
  },
  {
    title: 'Queue Consumers Re-architecture',
    description: 'Re-architect queue consumers for better reliability and performance. Implement proper error handling, add retry mechanisms, optimize batch processing, and ensure message ordering.',
    category: 'programming',
    complexity: 'high',
    price_min: 15000,
    price_max: 35000,
    default_commission_percent: 15,
    delivery_window: '1-4w'
  },
  {
    title: 'Fault-Tolerant Job Processing',
    description: 'Implement fault-tolerant job processing system. Add idempotency, implement retry logic, handle partial failures, and ensure job completion guarantees.',
    category: 'programming',
    complexity: 'high',
    price_min: 18000,
    price_max: 40000,
    default_commission_percent: 15,
    delivery_window: '1-4w'
  },
  {
    title: 'Cleaning and Upgrading Legacy Python/Java Codebases',
    description: 'Clean and upgrade legacy codebases. Refactor code, update dependencies, fix deprecated APIs, improve code quality, and ensure compatibility with newer versions.',
    category: 'programming',
    complexity: 'high',
    price_min: 20000,
    price_max: 50000,
    default_commission_percent: 18,
    delivery_window: '1-4w'
  },
  {
    title: 'Migration from Node to NestJS or Express to FastAPI',
    description: 'Migrate backend services from one framework to another. Design migration strategy, implement equivalent functionality, ensure API compatibility, and migrate tests.',
    category: 'programming',
    complexity: 'high',
    price_min: 25000,
    price_max: 60000,
    default_commission_percent: 18,
    delivery_window: '1-4w'
  },
  {
    title: 'Strong Static Typing Conversion (TS Types Refactor)',
    description: 'Refactor JavaScript/TypeScript codebase to use strong static typing. Add proper type definitions, fix type errors, improve type safety, and ensure type coverage.',
    category: 'programming',
    complexity: 'medium',
    price_min: 10000,
    price_max: 25000,
    default_commission_percent: 12,
    delivery_window: '3-7d'
  },
  {
    title: 'Memory Profiling and Leak Resolution on APIs',
    description: 'Profile API memory usage and resolve memory leaks. Use profiling tools, identify memory leaks, implement fixes, and verify memory usage improvements.',
    category: 'programming',
    complexity: 'high',
    price_min: 12000,
    price_max: 30000,
    default_commission_percent: 15,
    delivery_window: '3-7d'
  },
  {
    title: 'Production API Error Rate Reduction',
    description: 'Reduce error rates in production APIs. Analyze error logs, identify root causes, implement fixes, add proper error handling, and improve system reliability.',
    category: 'programming',
    complexity: 'high',
    price_min: 15000,
    price_max: 35000,
    default_commission_percent: 15,
    delivery_window: '1-4w'
  }
]

// Export for use in seed scripts and API endpoints
export default PROGRAMMING_MICROTASKS
