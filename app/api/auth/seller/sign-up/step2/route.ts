// app/api/auth/seller/sign-up/step2/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, Seller } from '@/models/UserSchema';
import { sellerStep2Schema } from '@/schemas/authSchema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate password data
    const validationResult = sellerStep2Schema.safeParse({
      password: body.password,
      confirmPassword: body.confirmPassword
    });
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { password } = validationResult.data;
    const { step1Data } = body;
    
    // Verify step1 data is present
    if (!step1Data || !step1Data.email || !step1Data.phone || !step1Data.gst) {
      return NextResponse.json(
        { error: 'Missing registration data. Please complete step 1 first.' },
        { status: 400 }
      );
    }
    
    const { email, phone, gst } = step1Data;
    
    await connectDB();
    
    // Check again if user already exists (race condition protection)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      role: 'seller',
    });
    
    await newUser.save();
    
    // Create seller profile
    const newSeller = new Seller({
      userId: newUser._id,
      gst,
      isVerified: false,
      stores: [],
      products: [],
      onboardingComplete: false,
    });
    
    await newSeller.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email, role: 'seller' },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Seller account created successfully',
        userId: newUser._id.toString(),
        token
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in seller step 2:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}