'use client';

import { usePrivy } from '@privy-io/react-auth';
import Wallet from './components/Wallet';
import DebugPanel from './components/DebugPanel';

export default function Home() {
  const { ready, authenticated, login, logout } = usePrivy();

  if (!ready) return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
      <p className="text-sm text-gray-500">Carregando...</p>
    </main>
  );

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#f8fafc] text-gray-900">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          <div className="text-xl font-bold tracking-tight text-[#132c69]">
            CryptoWallet
          </div>

          <button
            onClick={login}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-[#132c69] hover:text-[#132c69]"
          >
            Login
          </button>
        </header>

        {/* Hero */}
        <section className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6">
          <div className="w-full max-w-4xl text-center">

            <p className="mb-5 text-sm font-medium uppercase tracking-widest text-[#132c69]">
              Sua carteira. Seu controle.
            </p>

            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Crie sua própria
              <span className="block text-[#132c69]">
                carteira de cripto.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
              Tenha sua própria carteira digital e gerencie seus ativos
              de forma simples, rápida e segura.
            </p>

            {/* Cadastro */}
            <button
              onClick={login}
              className="mt-8 cursor-pointer rounded-xl bg-[#132c69] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition-all duration-200 hover:scale-105 hover:bg-[#0e2356] active:scale-95"
            >
              Cadastre-se
            </button>

          </div>
        </section>

        <DebugPanel />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-6">
      <Wallet />

      <button
        onClick={logout}
        className="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 transition hover:bg-red-500 hover:text-white"
      >
        Sair
      </button>

      <DebugPanel />
    </main>
  );
}