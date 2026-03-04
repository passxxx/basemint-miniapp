"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";
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
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction";

export function MintCard() {
  const { address, isConnected } = useAccount();
  const [mintCount, setMintCount] = useState(1);
  const [justMinted, setJustMinted] = useState(false);

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

  // Mint 交易调用 —— 附带 Builder Code data suffix（ERC-8021 归因）
  const mintCalls = [
    {
      to: CONTRACT_ADDRESS as `0x${string}`,
      data: encodeMintCall(mintCount),
      value: BigInt(0),
      dataSuffix: BUILDER_CODE_SUFFIX as `0x${string}`,
    },
  ];

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      if (status.statusName === "success") {
        setJustMinted(true);
        refetchSupply();
        setTimeout(() => setJustMinted(false), 3000);
      }
    },
    [refetchSupply]
  );

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
              <path
                d="M40 20L55 35L40 50L25 35L40 20Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M40 35L55 50L40 65L25 50L40 35Z"
                fill="white"
                opacity="0.5"
              />
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
          <button
            className="qty-btn"
            onClick={() => setMintCount(Math.max(1, mintCount - 1))}
          >
            −
          </button>
          <span className="qty-value">{mintCount}</span>
          <button
            className="qty-btn"
            onClick={() => setMintCount(Math.min(10, mintCount + 1))}
          >
            +
          </button>
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
            {/* 用户信息 */}
            <div className="user-info">
              <Identity address={address} className="identity-row">
                <Avatar className="user-avatar" />
                <Name className="user-name" />
              </Identity>
              {balance > 0 && (
                <span className="user-balance">You own: {balance} NFT{balance > 1 ? "s" : ""}</span>
              )}
            </div>

            <Transaction
              chainId={8453}
              calls={mintCalls}
              onStatus={handleOnStatus}
            >
              <TransactionButton
                className="mint-btn"
                text={justMinted ? "Minted!" : `Mint ${mintCount} NFT${mintCount > 1 ? "s" : ""}`}
              />
              <TransactionStatus>
                <TransactionStatusLabel />
                <TransactionStatusAction />
              </TransactionStatus>
            </Transaction>
          </>
        )}
      </div>

      {/* 合约信息 */}
      <div className="contract-info">
        <a
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

/**
 * 手动编码 mint(uint256) 的 calldata
 * function selector = keccak256("mint(uint256)") 前 4 bytes = 0xa0712d68
 */
function encodeMintCall(quantity: number): `0x${string}` {
  const selector = "a0712d68";
  const param = quantity.toString(16).padStart(64, "0");
  return `0x${selector}${param}`;
}
