/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { TaskCard } from '@/components/tasks/TaskCard'
import type { Job } from '@/types/jobs'

const mockTask: Job = {
  id: '1',
  client_id: 'client-1',
  title: 'Build React Component Library',
  description: 'Create a comprehensive React component library with TypeScript, Storybook, and unit tests. Components should be accessible and follow WCAG 2.1 AA standards.',
  category_id: 'cat-1',
  microtask_id: null,
  custom: true,
  status: 'open',
  price_fixed: 15000,
  price_currency: 'INR',
  delivery_deadline: null,
  delivery_window: 'oneTo4w',
  escrow_id: null,
  required_skills: ['React', 'TypeScript', 'Storybook'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  requested_at: new Date().toISOString(),
  category: {
    id: 'cat-1',
    name: 'Frontend Development',
    slug: 'frontend',
    icon: null,
  },
  client: {
    id: 'client-1',
    full_name: 'Tech Startup Inc',
    email: 'client@example.com',
    trust_score: 85,
  },
}

describe('TaskCard', () => {
  it('renders task title and description', () => {
    render(<TaskCard task={mockTask} />)
    
    expect(screen.getByText('Build React Component Library')).toBeInTheDocument()
    expect(screen.getByText(/Create a comprehensive React component library/)).toBeInTheDocument()
  })

  it('displays price correctly', () => {
    render(<TaskCard task={mockTask} />)
    
    expect(screen.getByText('₹15,000')).toBeInTheDocument()
  })

  it('shows verified badge when client trust score > 80', () => {
    render(<TaskCard task={mockTask} />)
    
    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  it('displays category badge', () => {
    render(<TaskCard task={mockTask} />)
    
    expect(screen.getByText('Frontend Development')).toBeInTheDocument()
  })

  it('shows required skills', () => {
    render(<TaskCard task={mockTask} />)
    
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Storybook')).toBeInTheDocument()
  })

  it('displays delivery window', () => {
    render(<TaskCard task={mockTask} />)
    
    expect(screen.getByText(/1-4 weeks/)).toBeInTheDocument()
  })

  it('calls onBidClick when Place Bid button is clicked', () => {
    const handleBidClick = jest.fn()
    render(<TaskCard task={mockTask} onBidClick={handleBidClick} showBidButton={true} />)
    
    const bidButton = screen.getByText('Place Bid')
    bidButton.click()
    
    expect(handleBidClick).toHaveBeenCalledWith(mockTask)
  })

  it('does not show bid button when showBidButton is false', () => {
    render(<TaskCard task={mockTask} showBidButton={false} />)
    
    expect(screen.queryByText('Place Bid')).not.toBeInTheDocument()
  })

  it('does not show verified badge when trust score <= 80', () => {
    const taskWithoutVerified = {
      ...mockTask,
      client: {
        ...mockTask.client!,
        trust_score: 75,
      },
    }
    
    render(<TaskCard task={taskWithoutVerified} />)
    
    expect(screen.queryByText('Verified')).not.toBeInTheDocument()
  })
})
