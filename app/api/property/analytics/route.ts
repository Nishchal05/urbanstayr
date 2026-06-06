import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { propertyId, event } = await request.json();

    if (!propertyId || !event) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (event === "impression") {
      await prisma.property.update({
        where: { id: propertyId },
        data: {
          impressionCount: { increment: 1 },
          lastImpressionAt: new Date(),
        },
      });
    } else if (event === "click") {
      await prisma.property.update({
        where: { id: propertyId },
        data: {
          clickCount: { increment: 1 },
          lastClickedAt: new Date(),
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to track analytics:", error);
    return NextResponse.json(
      { error: "Failed to track analytics" },
      { status: 500 }
    );
  }
}
