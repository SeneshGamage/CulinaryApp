import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Single source of truth for online/offline state app-wide.
 * Treats "unknown" connectivity as online optimistically on first render,
 * then corrects once NetInfo reports in — avoids a flash of offline UI.
 */
export function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
    return () => unsubscribe();
  }, []);

  return isOnline;
}
