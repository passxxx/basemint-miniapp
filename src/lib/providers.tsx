"use client";

import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { OnchainKitProvider } from "@coinbase/onchainkit";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{ appearance: { mode: "dark" } }}
    >
      <MiniKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
      >
        {children}
      </MiniKitProvider>
    </OnchainKitProvider>
  );
}
