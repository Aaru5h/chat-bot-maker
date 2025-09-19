import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCollection } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    // Validation
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ message: "Email, password, and name are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ message: "Password must be at least 6 characters long" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get users collection
    const usersCollection = await getCollection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User with this email already exists" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user object
    const newUser = {
      email,
      name,
      password: hashedPassword,
      createdAt: new Date()
    };

    // Insert user into database
    const result = await usersCollection.insertOne(newUser);

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: result.insertedId.toString(), email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return new Response(
      JSON.stringify({ 
        message: "User registered successfully",
        token: jwtToken, // Using JWT token for both fields
        jwt: jwtToken,
        user: {
          id: result.insertedId.toString(),
          email: newUser.email,
          name: newUser.name
        }
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error during user registration:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
