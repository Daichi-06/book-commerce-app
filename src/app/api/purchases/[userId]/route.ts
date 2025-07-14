import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  const { userId } = await params;
  try {
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json(purchases);
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
