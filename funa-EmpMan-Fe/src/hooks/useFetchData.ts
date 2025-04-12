import { useState, useEffect } from 'react';

interface UseFetchDataOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  dependencies?: any[];
}

const useFetchData = <T>(fetchFn: () => Promise<T>, options: UseFetchDataOptions = {}) => {
  const { initialData = null, onSuccess, onError, dependencies = [] } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFn();

        if (isMounted) {
          setData(result);
          setError(null);
          if (onSuccess) onSuccess(result);
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('An unknown error occurred');
          setError(error);
          if (onError) onError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      setData(result);
      setError(null);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      if (onError) onError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export default useFetchData;
