import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export function useFocusData<T>(loader: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    loader()
      .then((result) => setData(result))
      .catch((e) => {
        console.error('useFocusData load failed:', e);
        setError(e);
      })
      .finally(() => setLoading(false));
  }, [loader]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true); // Set loading to true when focus-triggered load begins
      setError(null);
      loader()
        .then((result) => {
          if (active) setData(result);
        })
        .catch((e) => {
          console.error('useFocusData load failed:', e);
          if (active) setError(e);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [loader]),
  );

  return { data, loading, error, retry, refresh: retry };
}