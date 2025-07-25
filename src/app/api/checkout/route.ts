import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const POST = async (req: NextRequest) => {
  const { title, price, bookId, userId } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        bookId,
      },
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: { name: title },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000`,
    });

    console.log("Created session:", {
      client_reference_id: userId,
    });

    return NextResponse.json({ checkout_url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
