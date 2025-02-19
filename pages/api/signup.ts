// pages/api/signup.ts
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("uta-housing"); // Replace with your database name

      // Check if the user already exists
      const existingUser = await db.collection("users").findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Insert the new user into the database
      await db.collection("users").insertOne({
        name,
        email,
        password: hashedPassword, // Save the hashed password
        createdAt: new Date(),
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}