'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import { sepolia } from "wagmi/chains";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENTE_ID}
            config={{
                loginMethods: ['email'],
                embeddedWallets: {
                    ethereum: {createOnLogin: 'users-without-wallets'}
                },
                defaultChain: sepolia,
                supportedChains: [sepolia]
            }}
        >
            {children}
        </PrivyProvider>
    );
}