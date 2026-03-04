"use client";

import { useCallback, useState } from "react";
import { useAccount, useReadContract, useSendTransaction } from "wagmi";
import { encodeFunctionData } from "viem";
import {
  ConnectWallet,
  Wallet,
} from "@coinbase/onchainkit/wallet";
import {
  Avatar,
  Name,
  Identity,
} from "@coinbase/onchainkit/identity";
import { CONTRACT_ADDRESS, NFT_ABI, BUILDER_CODE_SUFFIX } from "@/lib/contract";

export function MintCard() {
  const { address, isConnected } = useAccount();
  const [mintCount, setMintCount] = useState(1);
  const [justMinted, setJustMinted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const { sendTransaction } = useSendTransaction();

  // 读取合约数据
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

  // 手动发交易，确保 dataSuffix 附加到 calldata 末尾
  const handleMint = useCallback(async () => {
    if (!address) return;
    setIsMinting(true);

    try {
      // 编码 mint(uint256) 的 calldata
      const mintData = encodeFunctionData({
        abi: NFT_ABI,
        functionName: "mint",
        args: [BigInt(mintCount)],
      });

      // 拼接 Builder Code suffix 到 calldata 末尾（ERC-8021 归因）
      const suffix = BUILDER_CODE_SUFFIX.startsWith("0x")
        ? BUILDER_CODE_SUFFIX.slice(2)
        : BUILDER_CODE_SUFFIX;
      const fullData = `${mintData}${suffix}` as `0x${string}`;

      sendTransaction(
        {
          to: CONTRACT_ADDRESS,
          data: fullData,
          value: BigInt(0),
        },
        {
          onSuccess: () => {
            setJustMinted(true);
            refetchSupply();
            setTimeout(() => setJustMinted(false), 3000);
            setIsMinting(false);
          },
          onError: (error) => {
            console.error("Mint failed:", error);
            setIsMinting(false);
          },
        }
      );
    } catch (error) {
      console.error("Mint error:", error);
      setIsMinting(false);
    }
  }, [address, mintCount, sendTransaction, refetchSupply]);

  const supply = totalSupply ? Number(totalSupply) : 0;
  const max = maxSupply ? Number(maxSupply) : 10000;
  const balance = userBalance ? Number(userBalance) : 0;
  const progress = max > 0 ? (supply / max) * 100 : 0;

  return (
    <div className="mint-card">
      {/* NFT 预览 */}
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

      {/* 进度条 */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Minted</span>
          <span className="progress-count">
            {supply.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 数量选择 */}
      <div className="quantity-section">
        <span className="quantity-label">Quantity</span>
        <div className="quantity-control">
          <button className="qty-btn" onClick={() => setMintCount(Math.max(1, mintCount - 1))}>−</button>
          <span className="qty-value">{mintCount}</span>
          <button className="qty-btn" onClick={() => setMintCount(Math.min(10, mintCount + 1))}>+</button>
        </div>
      </div>

      {/* 价格信息 */}
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

      {/* Mint 按钮 */}
      <div className="action-section">
        {!isConnected ? (
          <Wallet>
            <ConnectWallet className="connect-btn">
              <span>Connect Wallet to Mint</span>
            </ConnectWallet>
          </Wallet>
        ) : (
          <>
            <div className="user-info">
              <Identity address={address} className="identity-row">
                <Avatar className="user-avatar" />
                <Name className="user-name" />
              </Identity>
              {balance > 0 && (
                <span className="user-balance">You own: {balance} NFT{balance > 1 ? "s" : ""}</span>
              )}
            </div>

            <button
              className="mint-btn"
              onClick={handleMint}
              disabled={isMinting}
            >
              {isMinting
                ? "Minting..."
                : justMinted
                ? "Minted!"
                : `Mint ${mintCount} NFT${mintCount > 1 ? "s" : ""}`}
            </button>
          </>
        )}
      </div>

      {/* 合约信息 */}
      <div className="contract-info">
        
          href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Contract on Basescan ↗
        </a>
      </div>
    </div>
  );
}
