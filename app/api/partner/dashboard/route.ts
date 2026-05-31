import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String(session.userId);

    // Two separate queries to avoid stale Prisma relation types
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscription: true,
        subscriptionstarting: true,
        subscriptionending: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const properties = await prisma.property.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        location: true,
        sector: true,
        area: true,
        rent: true,
        electricity: true,
        propertyType: true,
        listingType: true,
        isVerified: true,
        isBoosted: true,
        clickCount: true,
        impressionCount: true,
        seoScore: true,
        boostEndsAt: true,
        photoProperty: true,
        createdAt: true,
      },
    });

    const totalClicks = properties.reduce((s, p) => s + p.clickCount, 0);
    const totalImpressions = properties.reduce((s, p) => s + p.impressionCount, 0);
    const verifiedCount = properties.filter((p) => p.isVerified).length;
    const boostedCount = properties.filter((p) => p.isBoosted).length;

    return NextResponse.json({
      partner: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        subscriptionstarting: user.subscriptionstarting,
        subscriptionending: user.subscriptionending,
        memberSince: user.createdAt,
      },
      stats: {
        totalProperties: properties.length,
        verifiedCount,
        boostedCount,
        totalClicks,
        totalImpressions,
      },
      properties,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
