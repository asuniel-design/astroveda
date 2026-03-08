import { createContext, useContext, useState, useCallback } from 'react';
import useSWR from 'swr';

const WalletContext = createContext({
  balance: null,
  freeUsed: null,
  userName: null,
  refreshBalance: () => {},
});

const fetcher = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('[WalletContext] Fetch error:', err.message);
    // Return safe fallback data
    return { balance: 0, freeUsed: false, userName: 'Guest User' };
  }
};

export function WalletProvider({ userId = 'user1', children }) {
  const { data, mutate } = useSWR(
    `/api/wallet/balance?userId=${userId}`,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      onError: () => {},
    }
  );

  const [localBalance, setLocalBalance] = useState(null);

  const balance = localBalance ?? data?.balance ?? null;
  const freeUsed = data?.freeUsed ?? null;
  const userName = data?.userName ?? null;

  const refreshBalance = useCallback(
    (newBalance) => {
      if (newBalance !== undefined) {
        setLocalBalance(newBalance);
      }
      mutate();
    },
    [mutate]
  );

  return (
    <WalletContext.Provider value={{ balance, freeUsed, userName, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
