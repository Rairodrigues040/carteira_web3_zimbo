'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { formatEther } from 'viem';
import { publicClient } from '@/lib/client';
import SendForm from './SendForm';

export default function Wallet() {
  const { wallets, ready } = useWallets();
  const wallet = wallets.find((w) => w.walletClientType === 'privy');
  const [balance, setBalance] = useState<bigint | null>(null);

  const refresh = useCallback(async () => {
    if (!wallet) return;
    const value = await publicClient.getBalance({
      address: wallet.address as `0x${string}`,
    });
    setBalance(value);
  }, [wallet]);

  useEffect(() => { refresh(); }, [refresh]);

  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(wallet?.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!ready) return (
    <p className="text-center text-gray-500">
      Carregando carteira...
    </p>
  );

  if (!wallet) return (
    <p className="text-center text-gray-500">
      Criando sua carteira...
    </p>
  );

  return (
  <section className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-[#132c69] to-[#00022d] shadow-sm">

    {/* Cabeçalho */}
    <div className="border-b border-gray-100 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-white">
            Saldo disponível
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-white ">
            {balance === null ? '...' : formatEther(balance)}
            <span className="ml-2 text-base font-medium text-white">
              ETH
            </span>
          </p>
        </div>
      </div>
    </div>

    {/* Endereço */}
    <div className="p-5 sm:p-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white">
        Endereço da carteira
      </p>

      <div className="rounded-xl bg-gray-50 p-2">
        <p className="break-all font-mono text-xs leading-relaxed text-gray-600 sm:text-sm">
          {wallet.address}
        </p>
      </div>

      {/* Botão de cópia */}
      <div className="mt-3">
        <button
          onClick={handleCopy}
          className="text-sm text-blue-400 hover:text-blue-200 font-medium transition cursor-pointer"
        >
          {copied ? 'Copiado!' : 'Copiar endereço'}
        </button>
      </div>

      {/* Enviar */}
      <div className="mt-5">
        <SendForm 
          fromAddress={wallet.address}
          balance={balance}
          onSent={refresh}
        />
      </div>
    </div>
  </section>
);
}