import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
export async function GET(){
    try{
       const session = await getSession();
       if(!session || !session.role){
        return NextResponse.json({message:"Unauthorized"}, {status:401});
       }
       const user = await prisma.employ.findUnique({
        where: {
            employid: session.userId as string,
        },
        include: {
            access: true,
        }
       });
       if(!user){
        return NextResponse.json({message:"User not found"}, {status:404});
       }
       return NextResponse.json({message:"User found", user});
    }catch(error){
        console.log(error)
    }
}