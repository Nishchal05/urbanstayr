import {prisma} from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params
        const property = await prisma.property.findUnique({
            where: { id: Number(id) },
        });
        return NextResponse.json(property);
    }catch(error){
        console.log(error)
    }
    return NextResponse.json({ message: "Property" });
}