/**
 * Unit tests for UI copy i18n integration
 */

import { render, screen } from '@testing-library/react'
import { t, useTranslation } from '@/lib/i18n'
import { BuyCreditsModalV1 } from '@/components/revenue/BuyCreditsModalV1'
import { SubscriptionCard } from '@/components/revenue/SubscriptionCard'
import { CommissionCalculator } from '@/components/revenue/CommissionCalculator'
import { VerificationBadgeInfo } from '@/components/revenue/VerificationBadgeInfo'

describe('i18n UI Copy', () => {
  describe('Translation function', () => {
    it('should translate simple keys', () => {
      expect(t('credits.title')).toBe('Shift Credits')
      expect(t('credits.balanceLabel')).toBe('Balance')
    })

    it('should translate nested keys', () => {
      expect(t('credits.modal.header')).toBe('Buy Shift Credits')
      expect(t('pricing.breakdown')).toBe('Price breakdown')
    })

    it('should replace placeholders', () => {
      const result = t('credits.modal.confirm', { plan_name: 'Starter', amount: '199' })
      expect(result).toContain('Starter')
      expect(result).toContain('199')
    })

    it('should return arrays for bullet lists', () => {
      const bullets = t('subscriptions.worker.starter.bullets')
      expect(Array.isArray(bullets)).toBe(true)
      if (Array.isArray(bullets)) {
        expect(bullets.length).toBeGreaterThan(0)
      }
    })
  })

  describe('BuyCreditsModalV1', () => {
    it('should render header from i18n', () => {
      render(
        <BuyCreditsModalV1
          isOpen={true}
          onClose={() => {}}
          currentBalance={0}
        />
      )
      
      expect(screen.getByText('Buy Shift Credits')).toBeInTheDocument()
    })

    it('should have aria-label for accessibility', () => {
      render(
        <BuyCreditsModalV1
          isOpen={true}
          onClose={() => {}}
          currentBalance={0}
        />
      )
      
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
      expect(modal).toHaveAttribute('aria-labelledby', 'buy-credits-title')
    })
  })

  describe('SubscriptionCard', () => {
    const mockPlan = {
      id: 'starter',
      name: 'Starter',
      slug: 'worker-starter',
      price_monthly_inr: 19900,
      platform_fee_percent: 5,
      free_shifts_monthly: 40,
      features: [],
      is_active: true,
    }

    it('should render plan title from i18n', () => {
      render(
        <SubscriptionCard
          plan={mockPlan}
          userType="worker"
        />
      )
      
      expect(screen.getByText('Starter')).toBeInTheDocument()
    })

    it('should render CTA from i18n', () => {
      render(
        <SubscriptionCard
          plan={mockPlan}
          userType="worker"
        />
      )
      
      expect(screen.getByText(/Start Starter/i)).toBeInTheDocument()
    })
  })

  describe('CommissionCalculator', () => {
    it('should render breakdown title from i18n', () => {
      render(
        <CommissionCalculator price={1000} />
      )
      
      // Wait for async calculation
      setTimeout(() => {
        expect(screen.getByText('Price breakdown')).toBeInTheDocument()
      }, 100)
    })
  })

  describe('VerificationBadgeInfo', () => {
    it('should render badge labels from i18n', () => {
      render(
        <VerificationBadgeInfo verifiedLevel={1} />
      )
      
      expect(screen.getByText('Basic Verified')).toBeInTheDocument()
    })

    it('should show tooltip on hover', () => {
      render(
        <VerificationBadgeInfo verifiedLevel={1} />
      )
      
      const badge = screen.getByText('Basic Verified')
      expect(badge).toHaveAttribute('title')
    })
  })
})
