/**
 * Credits Hook - Uses v1 API
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';

interface UseCreditsReturn {
  balance: number;
  reserved: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCredits(): UseCreditsReturn {
  const [balance, setBalance] = useState(0);
  const [reserved, setReserved] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const result = await apiClient.getCreditsBalance();
    
    if (result.error) {
      setError(result.error.message || 'Failed to fetch balance');
    } else if (result.data) {
      setBalance(result.data.balance || 0);
      setReserved(result.data.reserved || 0);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    reserved,
    isLoading,
    error,
    refetch: fetchBalance,
  };
}
