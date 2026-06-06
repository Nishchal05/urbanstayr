import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    try{
         const session= await getSession();
         if(!session){
             return NextResponse.json({message:"Unauthorized"}, {status:401});
         }
         console.log(session);
         const user = await prisma.employ.findUnique({
            where: {
                companyEmail: session.email as string,
            },
         });
         if(!user){
             return NextResponse.json({message:"User not found"}, {status:404});
         }
         const property=await prisma.property.findMany({
             where: {
                 isVerified: false,
             },
         });
         return NextResponse.json({message:"Property fetched successfully", property});
    }catch(error){
        console.log(error);
        return NextResponse.json({message:"Failed to fetch property"}, {status:500});
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if(!session){
             return NextResponse.json({message:"Unauthorized"}, {status:401});
        }
        
        const user = await prisma.employ.findUnique({
            where: {
                companyEmail: session.email as string,
            },
        });
        if(!user){
             return NextResponse.json({message:"User not found"}, {status:404});
        }
        
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({message:"Property ID is required"}, {status:400});
        }

        const updatedProperty = await prisma.property.update({
            where: { id: Number(id) },
            data: {
                isVerified: true,
                verifiedBy: user.employid,
            }
        });

        return NextResponse.json({message:"Property verified successfully", property: updatedProperty});

    } catch (error) {
        console.error(error);
        return NextResponse.json({message:"Failed to verify property"}, {status:500});
    }
}