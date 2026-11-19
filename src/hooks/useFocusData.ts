import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export function useFocusData<T>(loader: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loader()
        .then((result) => {
          if (active) setData(result);
        })
        .catch((e) => console.error('useFocusData load failed:', e))
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [loader]),
  );

  return { data, loading };
}