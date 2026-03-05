import type { Metadata } from "next";
import { Providers } from "@/lib/providers";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_URL || "https://basemint-miniapp.vercel.app";

export const metadata: Metadata = {
  title: "BaseMint - Free NFT Mint on Base",
  description: "Mint your free NFT on Base network. Built with OnchainKit.",
  other: {
    // Farcaster Mini App 元数据 —— 这段很关键，让 Warpcast 和 Base App 识别为 Mini App
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${APP_URL}/og.png`,
      button: {
        title: "Mint Free NFT",
        action: {
          type: "launch_frame",
          name: "BaseMint",
          url: APP_URL,
          splashImageUrl: `${APP_URL}/splash.png`,
          splashBackgroundColor: "#0A0E1A",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* base.dev 域名验证 meta 标签 —— 等 Vercel 部署后去 base.dev 拿到实际值再替换 */}
        {/* <meta name="base-verification" content="你的验证码" /> */}
       <meta name="talentapp:project_verification" content="97c84bf75962f1de940c82a2cab3c2aa4bfc401242214c8df8d1e1f8bf5ef238d5aab71d997bac3a6189716841f6faf4d911a223d5cda4b130482cfcb7725815" />
        <meta name="base:app_id" content="699ffb5dc66a772e1092e799" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
