import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCollection } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get users collection
    const usersCollection = await getCollection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      email,
      name,
      password: hashedPassword,
      createdAt: new Date()
    };

    // Insert user into database
    const result = await usersCollection.insertOne(newUser);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertedId.toString(), email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertedId.toString(),
        email: newUser.email,
        name: newUser.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // More specific error handling
    let errorMessage = 'Internal server error';
    if (error.message?.includes('MONGODB_URI')) {
      errorMessage = 'Database configuration error';
    } else if (error.message?.includes('MongoError')) {
      errorMessage = 'Database connection error';
    } else if (error.name === 'ValidationError') {
      errorMessage = 'Invalid input data';
    }
    
    return NextResponse.json(
      { 
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
