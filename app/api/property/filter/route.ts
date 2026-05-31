import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // listingType (pg, buy, sell)
    const propertyType = searchParams.get("propertyType"); // PG, Hostel, Flat, etc.
    const maxBudget = searchParams.get("maxBudget"); // Number

    // Build the query where clause - only show verified properties
    const whereClause: any = {
      isVerified: true,
    };

    if (type && type !== "all") {
      whereClause.listingType = type;
    }

    if (propertyType && propertyType !== "All") {
      whereClause.propertyType = propertyType;
    }

    if (maxBudget) {
      const budgetNum = parseInt(maxBudget, 10);
      if (!isNaN(budgetNum) && budgetNum > 0) {
        whereClause.rent = {
          lte: budgetNum,
        };
      }
    }

    // Query from Prisma database
    const properties = await prisma.property.findMany({
      where: whereClause,
      orderBy: [
        { isBoosted: "desc" },
        { seoScore: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Failed to filter properties:", error);
    return NextResponse.json(
      { error: "Something went wrong fetching properties" },
      { status: 500 }
    );
  }
}
