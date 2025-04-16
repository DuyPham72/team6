import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';
// Remove the Prisma import
// import { db } from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  
  // Only allow authenticated users to update reviews
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (req.method === "POST") {
    try {
      const { housingId, apartmentName, name, email, comment, rating, isAnonymous, userId } = req.body;
      
      // Basic validation
      if (!housingId || !apartmentName || !name || !email || !comment || !rating || !userId) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("uta-housing"); // Use the same DB as signup
      
      // Insert the new review into the database
      const result = await db.collection("reviews").insertOne({
        housingId,
        apartmentName, // Store the apartment name
        name,
        email,
        comment,
        rating,
        isAnonymous: isAnonymous || false,
        createdAt: new Date(),
        userId, // Store the user ID from the request body
      });
      
      return res.status(201).json({ 
        message: "Review submitted successfully",
        reviewId: result.insertedId
      });
    } catch (error) {
      console.error("Error in API route:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { reviewId, comment, rating, isAnonymous } = req.body;
      
      if (!reviewId || !comment || !rating) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("uta-housing");
      
      // Check if the review exists and belongs to the user
      const existingReview = await db.collection("reviews").findOne({
        _id: new ObjectId(reviewId),
      });
      
      if (!existingReview) {
        return res.status(404).json({ error: 'Review not found' });
      }
      
      if (existingReview.userId !== userId) {
        return res.status(403).json({ error: 'You can only edit your own reviews' });
      }
      
      // Update the review
      const updatedReview = await db.collection("reviews").findOneAndUpdate(
        { _id: new ObjectId(reviewId) },
        { 
          $set: {
            comment,
            rating,
            isAnonymous,
            updatedAt: new Date(),
          }
        },
        { returnDocument: 'after' }
      );
      
      if (!updatedReview || !updatedReview.value) {
        return res.status(404).json({ error: 'Failed to update review' });
      }
      
      return res.status(200).json(updatedReview.value);
    } catch (error) {
      console.error('Error updating review:', error);
      return res.status(500).json({ error: 'Failed to update review' });
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT"]);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}