import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
export async function POST(req: NextRequest){
  try{
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
    const origin = req.headers.get("origin") || `https://${process.env.NEXT_PUBLIC_DOMAIN}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`
    });
    return NextResponse.redirect(session.url!, 303);
  }catch(e:any){
    return NextResponse.json({ error: e?.message || 'stripe_error' }, { status: 500 });
  }
}
