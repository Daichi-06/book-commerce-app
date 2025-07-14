import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
// 購入履歴の保存
export const POST = async (req: NextRequest) => {
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }
  console.log("sessionIdです", sessionId);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("session", session);
    console.log("aaa", session.metadata?.bookId);

    if (!session.metadata?.bookId || !session.client_reference_id) {
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 });
    }

    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: session.client_reference_id,
        bookId: session.metadata.bookId,
      },
    });

    if (!existingPurchase) {
      const purchase = await prisma.purchase.create({
        data: {
          userId: session.client_reference_id,
          bookId: session.metadata.bookId,
        },
      });
      return NextResponse.json({ purchase }, { status: 200 });
    } else {
      return NextResponse.json({ message: "You have already purchased this book" });
    }
  } catch (error) {
    console.error("Purchase creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
