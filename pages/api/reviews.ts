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
  
  // Debug logging
  console.log('Request method:', req.method);
  console.log('Authenticated user:', userId);
  
  // Only allow authenticated users to update reviews
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (req.method === "POST") {
    try {
      const { housingId, apartmentName, name, email, comment, rating, isAnonymous, userId } = req.body;
      
      // Debug logging
      console.log('Saving review with data:', {
        housingId,
        apartmentName,
        name,
        email,
        comment,
        rating,
        isAnonymous,
        userId
      });
      
      // Basic validation
      if (!housingId || !apartmentName || !name || !email || !comment || !rating || !userId) {
        console.log('Validation failed:', { housingId, apartmentName, name, email, comment, rating, userId });
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("uta-housing");
      
      // Ensure housingId is a string
      const reviewData = {
        housingId: String(housingId),
        apartmentName,
        name,
        email,
        comment,
        rating,
        isAnonymous: isAnonymous || false,
        createdAt: new Date(),
        userId,
      };
      
      // Debug logging
      console.log('Inserting review data:', reviewData);
      console.log('housingId type:', typeof housingId, 'value:', housingId);
      console.log('Converted housingId type:', typeof reviewData.housingId, 'value:', reviewData.housingId);
      
      // Insert the new review into the database
      const result = await db.collection("reviews").insertOne(reviewData);
      
      // Debug logging
      console.log('Review saved with ID:', result.insertedId);
      
      // Verify the saved review
      const savedReview = await db.collection("reviews").findOne({ _id: result.insertedId });
      console.log('Saved review from database:', savedReview);
      
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
      
      // Debug logging
      console.log('Updating review:', { reviewId, comment, rating, isAnonymous });
      
      if (!reviewId || !comment || !rating) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("uta-housing");
      
      // Check if the review exists and belongs to the user
      let existingReview;
      try {
        // First try to find the review without ObjectId conversion
        existingReview = await db.collection("reviews").findOne({
          _id: reviewId,
        });
        
        // If not found, try with ObjectId conversion
        if (!existingReview) {
          try {
            existingReview = await db.collection("reviews").findOne({
              _id: new ObjectId(reviewId),
            });
          } catch (objectIdError) {
            console.error('Error converting reviewId to ObjectId:', objectIdError);
            return res.status(400).json({ error: 'Invalid review ID format' });
          }
        }
      } catch (error) {
        console.error('Error finding review:', error);
        return res.status(500).json({ error: 'Error finding review' });
      }
      
      // Debug logging
      console.log('Found existing review:', existingReview);
      
      if (!existingReview) {
        return res.status(404).json({ error: 'Review not found' });
      }
      
      if (existingReview.userId !== userId) {
        return res.status(403).json({ error: 'You can only edit your own reviews' });
      }
      
      // Update the review
      let updatedReview;
      try {
        // Use the same _id format as the existing review
        const updateQuery = { _id: existingReview._id };
        
        await db.collection("reviews").updateOne(
          updateQuery,
          { 
            $set: {
              comment,
              rating,
              isAnonymous,
              updatedAt: new Date(),
            }
          }
        );
        
        // Fetch the updated review
        updatedReview = await db.collection("reviews").findOne(updateQuery);
      } catch (error) {
        console.error('Error updating review:', error);
        return res.status(500).json({ error: 'Failed to update review' });
      }
      
      // Debug logging
      console.log('Updated review:', updatedReview);
      
      if (!updatedReview) {
        return res.status(500).json({ error: 'Failed to retrieve updated review' });
      }
      
      return res.status(200).json(updatedReview);
    } catch (error) {
      console.error('Error in PUT handler:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT"]);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}