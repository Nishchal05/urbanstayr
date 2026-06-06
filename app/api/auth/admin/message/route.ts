import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if(!session){
             return NextResponse.json({message:"Unauthorized"}, {status:401});
        }
        
        const body = await request.json();
        const { propertyId, feedback } = body;

        if (!propertyId || !feedback) {
            return NextResponse.json({message:"Property ID and feedback are required"}, {status:400});
        }
        console.log(`Rejection Feedback for property ${propertyId}:`, feedback);
        
        // Update the property status and reason
        const updatedProperty = await prisma.property.update({
            where: { id: Number(propertyId) },
            data: {
                status: "REJECTED",
                rejectionReason: feedback,
                isVerified: false
            }
        });

        // Notify the partner
        if (updatedProperty.userId) {
            await prisma.notification.create({
                data: {
                    userId: updatedProperty.userId,
                    message: `Your property "${updatedProperty.name}" was rejected. Reason: ${feedback}`
                }
            });
        }

        return NextResponse.json({message:"Feedback received and property rejected successfully"});

    } catch (error) {
        console.error(error);
        return NextResponse.json({message:"Failed to reject property"}, {status:500});
    }
}
