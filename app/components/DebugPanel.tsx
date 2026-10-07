'use client';

import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

export default function DebugPanel() {
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  if (process.env.NODE_ENV !== 'development') return null;

  async function handleOpen() {
    setToken(await getAccessToken());
    setOpen(!open);
  }

  const data = {
    ready,
    authenticated,
    userId: user?.id,
    email: user?.email?.address,
    createdAt: user?.createdAt,
    accessToken: token,
    wallets: wallets.map((w) => ({
      address: w.address,
      chainId: w.chainId,
      type: w.walletClientType,
    })),
    user,
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleOpen}
        className="rounded-lg bg-black px-3 py-2 text-xs font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-800 active:scale-95"
      >
        Debug
      </button>

      {open && (
        <div className="absolute bottom-12 right-0 w-[90vw] max-w-2xl overflow-hidden rounded-xl border border-gray-700 bg-[#00022d] shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
            <span className="text-sm font-semibold text-green-400">
              Privy Debug
            </span>

            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 transition-colors hover:text-white"
            >
              ✕
            </button>
          </div>

          <pre className="max-h-[70vh] overflow-auto p-4 text-xs leading-relaxed text-green-400">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}