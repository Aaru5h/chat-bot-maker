import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getData, postData, putData } from "@/app/api/utils";
import dbAddress from "@/db";

const filePath = path.join(dbAddress, "users.json");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const registerToken = async (email) => {
  const token = new Date().toISOString() + "#@#" + email;
  const file = path.join(dbAddress, "tokenRegistry.json");
  await postData(file, token);
  return token;
};

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    // Validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
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

    const users = await getData(filePath);

    const existingUser = users.find((user) => user.email === email);
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
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    await postData(filePath, newUser);

    // Generate tokens
    const legacyToken = await registerToken(email);
    const jwtToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return new Response(
      JSON.stringify({ 
        message: "User registered successfully",
        token: legacyToken,
        jwt: jwtToken,
        user: {
          id: newUser.id,
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
