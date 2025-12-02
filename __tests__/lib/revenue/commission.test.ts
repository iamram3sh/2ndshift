/**
 * Tests for commission calculation
 */

import {
  calculateWorkerCommission,
  calculateClientCommission,
  calculateEscrowFee,
  calculateCommissions,
} from '@/lib/revenue/commission';

describe('Commission Calculation', () => {
  describe('calculateWorkerCommission', () => {
    it('should return 0% for first 3 jobs', () => {
      const result = calculateWorkerCommission(10000, true, true);
      expect(result.percent).toBe(0);
      expect(result.amount).toBe(0);
    });

    it('should return 5% for verified workers', () => {
      const result = calculateWorkerCommission(10000, true, false);
      expect(result.percent).toBe(5);
      expect(result.amount).toBe(500);
    });

    it('should return 10% for unverified workers', () => {
      const result = calculateWorkerCommission(10000, false, false);
      expect(result.percent).toBe(10);
      expect(result.amount).toBe(1000);
    });
  });

  describe('calculateClientCommission', () => {
    it('should return 0% for subscribers', () => {
      const result = calculateClientCommission(10000, true, false);
      expect(result.percent).toBe(0);
      expect(result.amount).toBe(0);
    });

    it('should return ₹49 flat fee for microtasks', () => {
      const result = calculateClientCommission(10000, false, true);
      expect(result.percent).toBe(0);
      expect(result.amount).toBe(49);
    });

    it('should return 4% for regular jobs', () => {
      const result = calculateClientCommission(10000, false, false);
      expect(result.percent).toBe(4);
      expect(result.amount).toBe(400);
    });
  });

  describe('calculateEscrowFee', () => {
    it('should calculate 2% escrow fee', () => {
      const fee = calculateEscrowFee(10000);
      expect(fee).toBe(200);
    });
  });

  describe('calculateCommissions', () => {
    it('should calculate complete commission breakdown', () => {
      const result = calculateCommissions({
        contractAmount: 10000,
        workerId: 'test-worker',
        isWorkerVerified: true,
        isFirstThreeJobs: false,
        clientHasSubscription: false,
        isMicroTask: false,
        paymentAmount: 10000,
      });

      expect(result.workerCommissionPercent).toBe(5);
      expect(result.workerCommissionAmount).toBe(500);
      expect(result.clientCommissionPercent).toBe(4);
      expect(result.clientCommissionAmount).toBe(400);
      expect(result.escrowFeePercent).toBe(2);
      expect(result.escrowFeeAmount).toBe(200);
      expect(result.netWorkerPayout).toBe(9500);
      expect(result.netClientPayment).toBe(10600);
      expect(result.totalPlatformRevenue).toBe(1100);
    });
  });
});
