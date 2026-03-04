import { base } from "wagmi/chains";

// 合约地址
export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  "0xA4d53ae318AD1138c6CAC6fEF5E04e94b08083E7";

// Builder Code data suffix（ERC-8021 归因）
export const BUILDER_CODE_SUFFIX =
  process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX ||
  "0x62635f6f6234746f61666d0b0080218021802180218021802180218021";

// 链配置
export const CHAIN = base;

// 合约 ABI（只保留需要的函数）
export const NFT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
export const BUILDER_CODE_NAME = "ob4toafm";
