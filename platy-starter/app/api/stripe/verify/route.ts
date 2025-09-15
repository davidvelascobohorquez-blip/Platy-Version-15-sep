import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
export async function GET(req: NextRequest){
  try {
    const session_id = req.nextUrl.searchParams.get("session_id")!;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
    const s = await stripe.checkout.sessions.retrieve(session_id);
    if (s.payment_status === "paid") {
      const res = NextResponse.json({ ok: true });
      res.cookies.set("platy_paid", "true", { httpOnly: true, sameSite: "lax", maxAge: 60*60*24*365 });
      return res;
    }
    return NextResponse.json({ ok: false, error: "unpaid" }, { status: 402 });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error: e?.message || "error" }, { status: 500 });
  }
}
