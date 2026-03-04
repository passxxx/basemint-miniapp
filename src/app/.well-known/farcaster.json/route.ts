import { NextResponse } from "next/server";

/**
 * Farcaster manifest 路由
 * Base App 和 Warpcast 会访问 /.well-known/farcaster.json 来获取 App 信息
 * 
 * ⚠️ accountAssociation 的值需要你在 build.base.org 扫码签名后拿到，
 *    然后替换下面的空字符串
 */
export async function GET() {
  const APP_URL = process.env.NEXT_PUBLIC_URL || "https://basemint-miniapp.vercel.app";

  const manifest = {
    accountAssociation: {
      // ⬇️ 等 Step 4 在 build.base.org 签名后，把拿到的值填在这里
      header: "",
      payload: "",
      signature: "",
    },
    frame: {
      version: "1",
      name: "BaseMint",
      subtitle: "Free NFT Mint on Base",
      description: "Mint your free NFT on Base network. Zero cost, just pay gas.",
      homeUrl: APP_URL,
      iconUrl: `${APP_URL}/icon.png`,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: "#0A0E1A",
      webhookUrl: `${APP_URL}/api/webhook`,
      primaryCategory: "developer-tools",
      tags: ["nft", "mint", "base", "free", "onchain"],
    },
  };

  return NextResponse.json(manifest);
}
