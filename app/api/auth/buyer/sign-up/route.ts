import { connectDB } from '@/lib/db';
import { User, Buyer } from '@/models/UserSchema';
import { buyerSignUpSchema } from '@/schemas/authSchema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input data
    const validationResult = buyerSignUpSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { name, email, password, phone } = validationResult.data;
    
    await connectDB();
    
    // Check if user already exists
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
      name,
      phone,
      role: 'buyer',
    });
    
    await newUser.save();
    
    // Create buyer profile
    const newBuyer = new Buyer({
      userId: newUser._id,
      addresses: [],
      wishlist: [],
      orders: [],
    });
    
    await newBuyer.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email, role: 'buyer' },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Buyer account created successfully',
        userId: newUser._id.toString(),
        token,
        name,
        email
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating buyer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}