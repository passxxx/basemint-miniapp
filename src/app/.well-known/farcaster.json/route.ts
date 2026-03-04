import { NextResponse } from "next/server";

export async function GET() {
  const APP_URL = process.env.NEXT_PUBLIC_URL || "https://basemint-miniapp.vercel.app";

  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjE3NzYyOTcsInR5cGUiOiJhdXRoIiwia2V5IjoiMHg1ZjNFZjg5RkI0MzdDMDRCQUQ5ODg3MmQ2M2RDRjIwMDgyRThkNDIzIn0",
      payload: "eyJkb21haW4iOiJiYXNlbWludC1taW5pYXBwLnZlcmNlbC5hcHAifQ",
      signature: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2UMd-QKAvTx6fsNVtgis_tKYWzVtU9MSFwQOWpqqpLsV6uuvUNwWCqJk2l7bgnARiW7tSoJ01AbkSJA-CC5rjgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAl8ZgIay2xclZzG8RWZzuWvO8j9R0fus3XxDee9lRlVy8FAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD3eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiRlNaOEVIU0tWWFo3SDhOYkdxbUZjblBPNm1wZ3d0V2lSaHlMV1J1U3pvNCIsIm9yaWdpbiI6Imh0dHBzOi8va2V5cy5jb2luYmFzZS5jb20iLCJjcm9zc09yaWdpbiI6ZmFsc2UsIm90aGVyX2tleXNfY2FuX2JlX2FkZGVkX2hlcmUiOiJkbyBub3QgY29tcGFyZSBjbGllbnREYXRhSlNPTiBhZ2FpbnN0IGEgdGVtcGxhdGUuIFNlZSBodHRwczovL2dvby5nbC95YWJQZXgifQAAAAAAAAAAAA",
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
