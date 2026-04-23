import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // ✅ Get user from token (cookie handled inside)
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.userId;

    // 📦 Get request body
    const body = await request.json();

    // 🛠 Create property
    const property = await prisma.property.create({
      data: {
        ...body,
        rent: Number(body.rent),
        electricity: Number(body.electricity),
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Property created successfully",
        property,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}