/**
 * Centralized category configuration for 2ndShift
 * Defines title, subtitle, hero tags, CTA text, and skills for each category
 */

export type CategorySlug =
  | "devops"
  | "cloud"
  | "networking"
  | "security"
  | "ai"
  | "data"
  | "sre"
  | "database"
  | "programming";

export type CategoryConfig = {
  slug: CategorySlug;
  title: string;
  subtitle: string;
  heroTags: string[];
  heroCtaLabel: string;
  heroCtaHref: string;
  skills: string[];
};

export const CATEGORY_CONFIG: Record<CategorySlug, CategoryConfig> = {
  devops: {
    slug: "devops",
    title: "DevOps & CI/CD",
    subtitle:
      "CI/CD pipelines, infrastructure automation, containerization, and deployment strategies.",
    heroTags: ["Docker & Kubernetes", "CI/CD Pipelines", "Infrastructure as Code"],
    heroCtaLabel: "Post a DevOps & CI/CD Task",
    heroCtaHref: "/projects/create?category=devops",
    skills: [
      "CI/CD",
      "Jenkins",
      "GitHub Actions",
      "GitLab CI",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "AWS",
      "Linux",
      "Monitoring & Alerts",
    ],
  },
  cloud: {
    slug: "cloud",
    title: "Cloud Engineering",
    subtitle:
      "AWS, Azure, GCP infrastructure, serverless, and cloud-native solutions.",
    heroTags: ["AWS, Azure, GCP", "Serverless Architecture", "Cloud Security"],
    heroCtaLabel: "Post a Cloud Engineering Task",
    heroCtaHref: "/projects/create?category=cloud",
    skills: [
      "AWS",
      "Azure",
      "GCP",
      "Cloud Security",
      "VPC & Networking",
      "Serverless",
      "Kubernetes",
      "Terraform",
      "Cost Optimization",
      "Disaster Recovery",
    ],
  },
  networking: {
    slug: "networking",
    title: "High-End Networking",
    subtitle:
      "Network architecture, security, VPN, load balancing, and infrastructure optimization.",
    heroTags: ["Network Architecture", "VPN & Security", "Load Balancing"],
    heroCtaLabel: "Post a Networking Task",
    heroCtaHref: "/projects/create?category=networking",
    skills: [
      "Routing",
      "Switching",
      "BGP",
      "OSPF",
      "Firewalls",
      "VPN",
      "Load Balancing",
      "Network Security",
      "SD-WAN",
      "QoS",
      "Wireless",
    ],
  },
  security: {
    slug: "security",
    title: "Cybersecurity",
    subtitle:
      "Security audits, penetration testing, compliance, and infrastructure hardening.",
    heroTags: ["Security Audits", "Penetration Testing", "Compliance & Hardening"],
    heroCtaLabel: "Post a Cybersecurity Task",
    heroCtaHref: "/projects/create?category=security",
    skills: [
      "Security Audit",
      "Vulnerability Assessment",
      "Penetration Testing",
      "Network Security",
      "Cloud Security",
      "Endpoint Security",
      "SIEM",
      "Incident Response",
      "Compliance",
      "Zero Trust",
    ],
  },
  ai: {
    slug: "ai",
    title: "AI / LLM Engineering",
    subtitle:
      "LLM fine-tuning, RAG pipelines, vector databases, and AI model deployment.",
    heroTags: ["LLM Fine-tuning", "RAG Pipelines", "Vector Databases"],
    heroCtaLabel: "Post an AI / LLM Task",
    heroCtaHref: "/projects/create?category=ai",
    skills: [
      "Machine Learning",
      "LLMs",
      "Prompt Engineering",
      "RAG",
      "Vector Databases",
      "MLOps",
      "Python",
      "PyTorch",
      "TensorFlow",
      "LangChain",
    ],
  },
  data: {
    slug: "data",
    title: "Data Engineering",
    subtitle:
      "ETL pipelines, data warehousing, real-time streaming, and big data processing.",
    heroTags: ["ETL Pipelines", "Data Warehousing", "Real-time Streaming"],
    heroCtaLabel: "Post a Data Engineering Task",
    heroCtaHref: "/projects/create?category=data",
    skills: [
      "ETL Pipelines",
      "SQL",
      "Data Warehousing",
      "Data Modeling",
      "Apache Spark",
      "Apache Airflow",
      "Kafka",
      "dbt",
      "BigQuery",
      "Redshift",
    ],
  },
  sre: {
    slug: "sre",
    title: "SRE & Observability",
    subtitle:
      "Site reliability, monitoring, incident response, and production operations.",
    heroTags: ["Monitoring & Alerting", "Incident Response", "System Reliability"],
    heroCtaLabel: "Post an SRE Task",
    heroCtaHref: "/projects/create?category=sre",
    skills: [
      "Site Reliability",
      "Observability",
      "Monitoring",
      "Incident Response",
      "On-call",
      "SLIs/SLOs",
      "Kubernetes",
      "Automation",
      "Chaos Engineering",
      "Logging & Tracing",
    ],
  },
  database: {
    slug: "database",
    title: "Database & Storage",
    subtitle:
      "Database optimization, migrations, replication, and storage architecture.",
    heroTags: ["Query Optimization", "Database Migrations", "Replication & Scaling"],
    heroCtaLabel: "Post a Database & Storage Task",
    heroCtaHref: "/projects/create?category=database",
    skills: [
      "Database Design",
      "Performance Tuning",
      "PostgreSQL",
      "MySQL",
      "SQL Server",
      "NoSQL",
      "Replication",
      "Backups",
      "Sharding",
      "High Availability",
    ],
  },
  programming: {
    slug: "programming",
    title: "Senior Backend & Systems Programming",
    subtitle:
      "Complex backend, API performance, concurrency, migrations, and production-critical systems.",
    heroTags: ["Complex Backend APIs", "Performance & Architecture", "Production-Critical Fixes"],
    heroCtaLabel: "Post a Backend & Systems Task",
    heroCtaHref: "/projects/create?category=programming",
    skills: [
      "Backend Development",
      "Distributed Systems",
      "REST APIs",
      "gRPC",
      "Microservices",
      "Performance Optimization",
      "Scalability",
      "Concurrency",
      "Go",
      "Java",
      "Node.js",
    ],
  },
};

/**
 * Get category config by slug
 */
export function getCategoryConfig(slug: string): CategoryConfig | undefined {
  return CATEGORY_CONFIG[slug as CategorySlug];
}

/**
 * Get all category slugs
 */
export function getAllCategorySlugs(): CategorySlug[] {
  return Object.keys(CATEGORY_CONFIG) as CategorySlug[];
}
