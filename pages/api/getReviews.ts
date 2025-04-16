import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { housingId } = req.query;
      
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("uta-housing");

      // Build the query based on whether housingId is provided
      const query = housingId ? { housingId: housingId } : {};

      // Fetch reviews with all necessary fields
      const reviews = await db.collection("reviews")
        .find(query)
        .project({
          _id: 1,
          userId: 1,
          housingId: 1,
          rating: 1,
          comment: 1,
          isAnonymous: 1,
          createdAt: 1,
          updatedAt: 1,
          name: 1,
          apartmentName: 1
        })
        .toArray();

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
