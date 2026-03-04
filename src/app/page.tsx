"use client";

import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { MintCard } from "@/components/MintCard";

export default function HomePage() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  // Mini App 初始化 —— 告诉宿主（Base App / Warpcast）本 App 已准备好显示
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <main className="app-container">
      <header className="app-header">
        <h1 className="app-logo">BaseMint</h1>
        <p className="app-tagline">Free NFT Collection on Base</p>
      </header>

      <MintCard />

      <footer className="app-footer">
        <p className="powered-by">
          Built on{" "}
          <a href="https://base.org" target="_blank" rel="noopener noreferrer">
            Base
          </a>
        </p>
      </footer>
    </main>
  );
}
