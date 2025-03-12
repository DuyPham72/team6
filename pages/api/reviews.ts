import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { housingId, apartmentName, name, email, comment, rating } = req.body;
      
      // Basic validation
      if (!housingId || !apartmentName || !name || !email || !comment || !rating) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("uta-housing"); // Use the same DB as signup
      
      // Insert the new review into the database
      await db.collection("reviews").insertOne({
        housingId,
        apartmentName, // Store the apartment name
        name,
        email,
        comment,
        rating,
        createdAt: new Date(),
      });
      
      return res.status(201).json({ message: "Review submitted successfully" });
    } catch (error) {
      console.error("Error in API route:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}