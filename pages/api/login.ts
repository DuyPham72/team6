// pages/api/login.ts
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt"; // For password comparison
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("uta-housing"); // Replace with your database name

      // Find the user by email
      const user = await db.collection("users").findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // If credentials are valid, return a success response
      res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}