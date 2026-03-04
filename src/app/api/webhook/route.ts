import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook 端点 —— Base App 发送通知事件用
 * 目前只做简单应答，后续可以扩展
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Webhook received:", body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
