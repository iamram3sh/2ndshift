// Google Analytics 4 Integration for 2ndShift

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// Initialize GA
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// Track events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Predefined events for common actions
export const trackEvent = {
  // User actions
  signup: (userType: 'worker' | 'client') => 
    event({ action: 'sign_up', category: 'User', label: userType }),
  
  login: (userType: 'worker' | 'client') => 
    event({ action: 'login', category: 'User', label: userType }),
  
  // Project actions
  projectCreated: (budget: number) => 
    event({ action: 'project_created', category: 'Project', value: budget }),
  
  projectApplied: (projectId: string) => 
    event({ action: 'project_applied', category: 'Project', label: projectId }),
  
  projectViewed: (projectId: string) => 
    event({ action: 'project_viewed', category: 'Project', label: projectId }),
  
  // Conversion events
  ctaClicked: (ctaName: string) => 
    event({ action: 'cta_clicked', category: 'Conversion', label: ctaName }),
  
  formSubmitted: (formName: string) => 
    event({ action: 'form_submitted', category: 'Conversion', label: formName }),
  
  // Payment events
  paymentInitiated: (amount: number) => 
    event({ action: 'payment_initiated', category: 'Payment', value: amount }),
  
  paymentCompleted: (amount: number) => 
    event({ action: 'payment_completed', category: 'Payment', value: amount }),
  
  // Engagement
  emailSubscribed: () => 
    event({ action: 'email_subscribed', category: 'Engagement' }),
  
  socialShare: (platform: string) => 
    event({ action: 'social_share', category: 'Engagement', label: platform }),
  
  // Search & Discovery
  searchPerformed: (query: string) => 
    event({ action: 'search', category: 'Discovery', label: query }),
  
  filterApplied: (filterType: string) => 
    event({ action: 'filter_applied', category: 'Discovery', label: filterType }),
}

// Track page views automatically
export const usePageTracking = () => {
  if (typeof window !== 'undefined') {
    const handleRouteChange = (url: string) => pageview(url)
    return handleRouteChange
  }
}

// Declare gtag for TypeScript (optional, as it may not be loaded)
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
