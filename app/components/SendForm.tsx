'use client';

import { useState } from 'react';
import { useSendTransaction } from '@privy-io/react-auth';
import { isAddress, parseEther } from 'viem';
import { sepolia } from 'viem/chains';
import { publicClient } from '@/lib/client';

type Props = { fromAddress: string; balance: bigint | null; onSent: () => void };

export default function SendForm({ fromAddress, balance, onSent }: Props) {
  const { sendTransaction } = useSendTransaction();
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending'>('idle');
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  async function handleConfirm() {
    setError('');
    if (!isAddress(to)) return setError('Endereço inválido');
    if (to.toLowerCase() === fromAddress.toLowerCase())
      return setError('Você não pode enviar para sua própria carteira');
    if (!(Number(amount) > 0)) return setError('Informe um valor maior que zero');
    const value = parseEther(amount);
    if (balance !== null && value > balance) return setError('Saldo insuficiente');

    try {
      setStatus('sending');
      const { hash } = await sendTransaction(
        { to, value, chainId: sepolia.id },
        { address: fromAddress },
      );
      await publicClient.waitForTransactionReceipt({ hash });
      setTxHash(hash);
      setAmount('');
      setTo('');
      onSent();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao enviar');
    } finally {
      setStatus('idle');
    }
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition cursor-pointer hover:bg-blue-700"
    >
      Enviar
    </button>
  );

  return (
    <div className="mt-4 space-y-3">
      <input
        placeholder="Quantidade (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        inputMode="decimal"
        className="w-full rounded-lg border bg-white border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />

      <input
        placeholder="Endereço de destino (0x...)"
        value={to}
        onChange={(e) => setTo(e.target.value.trim())}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />

      <div className="flex gap-2">
        <button
          onClick={handleConfirm}
          disabled={status === 'sending'}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {status === 'sending' ? 'Enviando...' : 'Confirmar'}
        </button>

        <button
          onClick={() => setOpen(false)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-red-500 hover:text-white cursor-pointer"
        >
          Cancelar
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          className="block rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700 hover:bg-green-100"
        >
          Ver transação
        </a>
      )}
    </div>
  );
}