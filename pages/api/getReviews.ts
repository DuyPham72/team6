import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { housingId } = req.query;
      
      // Debug logging
      console.log('Fetching reviews with query:', { housingId });
      
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("uta-housing");

      // First, let's log ALL reviews in the database
      const allReviews = await db.collection("reviews").find({}).toArray();
      console.log('ALL REVIEWS IN DATABASE:', allReviews.length);
      console.log('ALL REVIEWS:', JSON.stringify(allReviews, null, 2));
      
      // Build the query based on whether housingId is provided
      // Handle both string and number housingId values
      let query = {};
      if (housingId) {
        const housingIdStr = String(housingId);
        query = {
          $or: [
            { housingId: housingIdStr },  // Match string ID
            { housingId: Number(housingId) }  // Match number ID
          ]
        };
      }
      
      // Debug logging
      console.log('MongoDB query:', query);

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
      
      // Debug logging
      console.log('Found reviews:', reviews.length);
      console.log('Reviews:', JSON.stringify(reviews, null, 2));

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
