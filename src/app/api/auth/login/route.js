import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getData, postData } from "@/app/api/utils";
import dbAddress from "@/db";

const filePath = path.join(dbAddress, "users.json");
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
    
    const users = await getData(filePath);
    const existingUser = users.find((user) => user.email === email);
    
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
    
    // Generate both types of tokens for compatibility
    const legacyToken = await registerToken(email);
    const jwtToken = jwt.sign(
      { userId: existingUser.id || existingUser.email, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return new Response(
      JSON.stringify({ 
        token: legacyToken, // Keep legacy token for existing code
        jwt: jwtToken,
        message: "User logged in successfully",
        user: {
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
    console.log(err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

const registerToken = async (email) => {
  const token = new Date().toISOString() + "#@#" + email;
  const file = path.join(dbAddress, "tokenRegistry.json");
  await postData(file, token);
  return token;
};
