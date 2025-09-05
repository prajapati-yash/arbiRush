'use client';

import { Providers as WagmiProviders } from '@/lib/providers';

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiProviders>{children}</WagmiProviders>;
}
