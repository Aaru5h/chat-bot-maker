import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCollection } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    // Validation
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Get users collection
    const usersCollection = await getCollection('users');
    const existingUser = await usersCollection.findOne({ email });
    
    if (!existingUser) {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Check password - support both hashed and plain text (for backward compatibility)
    let isPasswordValid = false;
    
    if (existingUser.password.startsWith('$2')) {
      // Hashed password
      isPasswordValid = await bcrypt.compare(password, existingUser.password);
    } else {
      // Plain text password (legacy)
      isPasswordValid = existingUser.password === password;
    }
    
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Generate JWT token (no longer using legacy token system)
    const jwtToken = jwt.sign(
      { userId: existingUser._id.toString(), email: existingUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return new Response(
      JSON.stringify({ 
        token: jwtToken, // Using JWT token for both fields for compatibility
        jwt: jwtToken,
        message: "User logged in successfully",
        user: {
          id: existingUser._id.toString(),
          email: existingUser.email,
          name: existingUser.name || existingUser.email.split('@')[0]
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
