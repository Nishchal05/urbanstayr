import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ userid: string }> }) {
  const { userid } = await params;
  try {
    const userdata = await prisma.user.findUnique({
      where: { id: String(userid) },
    });
    return NextResponse.json(userdata, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
