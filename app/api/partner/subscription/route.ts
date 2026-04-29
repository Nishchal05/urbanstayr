import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PLANS = [
  { id: "free",    durationMonths: 2 },
  { id: "premium", durationMonths: 6 },
  { id: "pro",     durationMonths: 9 },
];

// ── Shared helper ─────────────────────────────────────────────────────────────
async function getUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    return decoded.userId ?? null;
  } catch {
    return null;
  }
}

// ── GET /api/partner/subscription ────────────────────────────────────────────
export async function GET() {
  try {
    const id = await getUserId();

    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findFirst({
      where: { id },
      select: { subscription: true },
    });

    return NextResponse.json({ subscription: user?.subscription ?? null }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── PUT /api/setsubscription ──────────────────────────────────────────────────
export async function PUT(request: NextRequest) {
  try {
    const id = await getUserId();

    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();

    const matched = PLANS.find((p) => p.id === plan);
    if (!matched) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const now = new Date();
    const ending = new Date(now);
    ending.setMonth(ending.getMonth() + matched.durationMonths);

    await prisma.user.update({
      where: { id },
      data: {
        subscription: plan,
        subscriptionstarting: now,
        subscriptionending: ending,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error setting subscription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}