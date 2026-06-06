import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {prisma} from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(request:Request){
    try{
        const {email,password, role}=await request.json();
        if(!email || !password){
            return NextResponse.json({message:"Please provide all the required fields"}, {status:400});
        }
        console.log("emial",email)
        console.log("password",password)
        const user = await prisma.employ.findUnique({
            where: {
                    companyEmail: email
                
            }
        });
        if(!user){
            return NextResponse.json({message:"User not found"}, {status:404});
        }
        const isPasswordMatched=await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            return NextResponse.json({message:"Invalid password"}, {status:401});
        }
        const token = await createToken({
              userId: user.employid,
              email: user.companyEmail,
              name: user.name,
              role: user.role,
            });
        const response=NextResponse.json({message:"Login successful", user});
        response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });

        return response;
        
    }catch(error){
console.log(error);
    }
}

