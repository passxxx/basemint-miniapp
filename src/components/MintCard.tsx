"use client";

import { useCallback, useState } from "react";
import { useAccount, useReadContract, useSendCalls, useConnect } from "wagmi";
import { encodeFunctionData } from "viem";
import { Attribution } from "ox/erc8021";
import { Avatar, Name, Identity } from "@coinbase/onchainkit/identity";
import { CONTRACT_ADDRESS, NFT_ABI, BUILDER_CODE_NAME } from "@/lib/contract";
import { trackTransaction } from "@/utils/track";

// Use ox library to generate the official ERC-8021 data suffix
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE_NAME],
});

export function MintCard() {
  const { address, isConnected } = useAccount();
  const [mintCount, setMintCount] = useState(1);
  const [justMinted, setJustMinted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { sendCalls } = useSendCalls();
  const { connect, connectors } = useConnect();

  const { data: totalSupply, refetch: refetchSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "totalSupply",
  });

  const { data: maxSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "MAX_SUPPLY",
  });

  const { data: nftName } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "name",
  });

  const { data: userBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const handleMint = useCallback(async () => {
    if (!address) return;
    setIsMinting(true);
    try {
      const mintData = encodeFunctionData({
        abi: NFT_ABI,
        functionName: "mint",
        args: [BigInt(mintCount)],
      });

      sendCalls(
        {
          calls: [
            {
              to: CONTRACT_ADDRESS,
              data: mintData,
              value: BigInt(0),
            },
          ],
          capabilities: {
            dataSuffix: {
              value: DATA_SUFFIX,
              optional: true,
            },
          },
        },
        {
          onSuccess: (data: unknown) => {
            setJustMinted(true);
            refetchSupply();
            setTimeout(() => setJustMinted(false), 3000);
            setIsMinting(false);

            try {
              const d = data as Record<string, unknown>;
              const txHash = typeof data === "string"
                ? data
                : (d?.hash as string) || (d?.id as string) || String(data) || "";
              if (txHash) {
                trackTransaction("app-001", "BaseMint", address, txHash);
              }
            } catch {
              // silent
            }
          },
          onError: () => {
            setIsMinting(false);
          },
        }
      );
    } catch (e) {
      console.error(e);
      setIsMinting(false);
    }
  }, [address, mintCount, sendCalls, refetchSupply]);

  const supply = totalSupply ? Number(totalSupply) : 0;
  const max = maxSupply ? Number(maxSupply) : 10000;
  const balance = userBalance ? Number(userBalance) : 0;
  const progress = max > 0 ? (supply / max) * 100 : 0;

  const btnText = isMinting
    ? "Minting..."
    : justMinted
      ? "Minted!"
      : "Mint " + mintCount + (mintCount > 1 ? " NFTs" : " NFT");

  return (
    <div className="mint-card">
      <div className="nft-preview">
        <div className="nft-visual">
          <div className="nft-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect width="80" height="80" rx="16" fill="#0052FF" />
              <path d="M40 20L55 35L40 50L25 35L40 20Z" fill="white" opacity="0.9" />
              <path d="M40 35L55 50L40 65L25 50L40 35Z" fill="white" opacity="0.5" />
            </svg>
          </div>
          <h2 className="nft-title">{nftName || "BaseMint NFT"}</h2>
          <p className="nft-subtitle">Free Mint on Base</p>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Minted</span>
          <span className="progress-count">
            {supply.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: progress + "%" }} />
        </div>
      </div>

      <div className="quantity-section">
        <span className="quantity-label">Quantity</span>
        <div className="quantity-control">
          <button className="qty-btn" onClick={() => setMintCount(Math.max(1, mintCount - 1))}>
            -
          </button>
          <span className="qty-value">{mintCount}</span>
          <button className="qty-btn" onClick={() => setMintCount(Math.min(10, mintCount + 1))}>
            +
          </button>
        </div>
      </div>

      <div className="price-section">
        <div className="price-row">
          <span>Price</span>
          <span className="price-free">FREE</span>
        </div>
        <div className="price-row">
          <span>Gas</span>
          <span className="price-gas">~$0.01</span>
        </div>
      </div>

      <div className="action-section">
       {!isConnected ? (
          <div className="wallet-options">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                className="mint-btn"
                onClick={() => connect({ connector })}
                style={{ marginBottom: "8px" }}
              >
                {connector.name}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="user-info">
              <Identity address={address} className="identity-row">
                <Avatar className="user-avatar" />
                <Name className="user-name" />
              </Identity>
              {balance > 0 && (
                <span className="user-balance">
                  {"You own: " + balance + (balance > 1 ? " NFTs" : " NFT")}
                </span>
              )}
            </div>

            <button
              className="mint-btn"
              onClick={handleMint}
              disabled={isMinting}
            >
              {btnText}
            </button>
          </div>
        )}
      </div>

      <div className="contract-info">
        <a
          href={"https://basescan.org/address/" + CONTRACT_ADDRESS}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Contract on Basescan
        </a>
      </div>
    </div>
  );
}
