import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
        "message":"hello we recieved!!"
    })
    // const { email, password, name } = await request.json();

    // // Validate input
    // if (!email || !password || !name) {
    //   return NextResponse.json(
    //     { error: 'Missing required fields' },
    //     { status: 400 }
    //   );
    // }

    // // Check if user exists (replace with your DB logic)
    // // const existingUser = await db.user.findUnique({ where: { email } });
    // // if (existingUser) {
    // //   return NextResponse.json(
    // //     { error: 'User already exists' },
    // //     { status: 409 }
    // //   );
    // // }

    // // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // // Create user in database (pseudo-code)
    // const user = {
    //   id: Date.now().toString(),
    //   email,
    //   name,
    //   password: hashedPassword,
    // };
    // // await db.user.create({ data: user });

    // // Create JWT token
    // const token = await createToken({
    //   userId: user.id,
    //   email: user.email,
    //   name: user.name,
    // });

    // // Set HTTP-only cookie
    // const response = NextResponse.json(
    //   { 
    //     message: 'Registration successful',
    //     user: { id: user.id, email: user.email, name: user.name }
    //   },
    //   { status: 201 }
    // );

    // response.cookies.set('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 60 * 60 * 24 * 7, // 7 days
    //   path: '/',
    // });

    // return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}