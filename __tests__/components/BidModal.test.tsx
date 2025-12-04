/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BidModal } from '@/components/tasks/BidModal'
import type { Job } from '@/types/jobs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockTask: Job = {
  id: '1',
  client_id: 'client-1',
  title: 'Build React Component Library',
  description: 'Create a comprehensive React component library',
  category_id: 'cat-1',
  microtask_id: null,
  custom: true,
  status: 'open',
  price_fixed: 15000,
  price_currency: 'INR',
  delivery_deadline: null,
  delivery_window: 'oneTo4w',
  escrow_id: null,
  required_skills: ['React', 'TypeScript'],
  urgency: 'normal',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  requested_at: new Date().toISOString(),
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('BidModal', () => {
  it('renders when open', () => {
    render(
      <BidModal
        isOpen={true}
        onClose={jest.fn()}
        task={mockTask}
      />,
      { wrapper: createWrapper() }
    )
    
    expect(screen.getByText('Place Your Bid')).toBeInTheDocument()
    expect(screen.getByText('Build React Component Library')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <BidModal
        isOpen={false}
        onClose={jest.fn()}
        task={mockTask}
      />,
      { wrapper: createWrapper() }
    )
    
    expect(screen.queryByText('Place Your Bid')).not.toBeInTheDocument()
  })

  it('displays task budget', () => {
    render(
      <BidModal
        isOpen={true}
        onClose={jest.fn()}
        task={mockTask}
      />,
      { wrapper: createWrapper() }
    )
    
    expect(screen.getByText('₹15,000')).toBeInTheDocument()
  })

  it('shows credits required and balance', async () => {
    render(
      <BidModal
        isOpen={true}
        onClose={jest.fn()}
        task={mockTask}
      />,
      { wrapper: createWrapper() }
    )
    
    await waitFor(() => {
      expect(screen.getByText(/Credits Required: 3/)).toBeInTheDocument()
    })
  })

  it('validates proposal text minimum length', async () => {
    const user = userEvent.setup()
    
    render(
      <BidModal
        isOpen={true}
        onClose={jest.fn()}
        task={mockTask}
      />,
      { wrapper: createWrapper() }
    )
    
    const proposalTextarea = screen.getByPlaceholderText(/Explain why you're the right fit/)
    await user.type(proposalTextarea, 'Short')
    
    const submitButton = screen.getByText(/Place Bid/)
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/must be at least 20 characters/)).toBeInTheDocument()
    })
  })

  it('validates proposed price minimum', async () => {
    const user = userEvent.setup()
    
    render(
      <BidModal
        isOpen={true}
        onClose={jest.fn()}
        task={mockTask}
      />,
      { wrapper: createWrapper() }
    )
    
    const priceInput = screen.getByPlaceholderText(/Enter amount/)
    await user.clear(priceInput)
    await user.type(priceInput, '30')
    
    const proposalTextarea = screen.getByPlaceholderText(/Explain why you're the right fit/)
    await user.type(proposalTextarea, 'This is a detailed proposal that meets the minimum length requirement of 20 characters.')
    
    const submitButton = screen.getByText(/Place Bid/)
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Minimum bid amount is ₹50/)).toBeInTheDocument()
    })
  })

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    
    render(
      <BidModal
        isOpen={true}
        onClose={onClose}
        task={mockTask}
      />,
      { wrapper: createWrapper() }
    )
    
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    
    render(
      <BidModal
        isOpen={true}
        onClose={onClose}
        task={mockTask}
      />,
      { wrapper: createWrapper() }
    )
    
    const backdrop = screen.getByRole('dialog').parentElement?.querySelector('.absolute')
    if (backdrop) {
      await user.click(backdrop)
      expect(onClose).toHaveBeenCalled()
    }
  })
})
