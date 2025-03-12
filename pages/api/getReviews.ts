import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { housingId } = req.query;
      
      if (!housingId) {
        return res.status(400).json({ message: "Missing housingId parameter" });
      }

      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("uta-housing");

      // Fetch reviews for the given housingId
      const reviews = await db.collection("reviews").find({ housingId: Number(housingId) }).toArray();

      return res.status(200).json({ reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
