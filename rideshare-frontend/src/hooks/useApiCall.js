// Custom hook for API calls with error handling and loading state

import { useState, useCallback } from 'react';

export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (apiFunction) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, execute };
}
