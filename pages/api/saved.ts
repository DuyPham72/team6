import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("uta-housing");
      const savedListings = await db
        .collection("saved")
        .find({ userId })
        .toArray();
      return res.status(200).json(savedListings);
    } catch (error) {
      console.error("Error fetching saved listings:", error);
      return res.status(500).json({ error: "Failed to fetch saved listings" });
    }
  }

  if (req.method === "POST") {
    try {
      const { listingId } = req.body;
      const client = await clientPromise;
      const db = client.db("uta-housing");

      // Convert listingId to string
      const listingIdStr = String(listingId);

      // Check if the listing exists in the housing collection
      const listing = await db.collection("housing").findOne({ id: listingIdStr });
      if (!listing) {
        return res.status(404).json({ error: "Housing listing not found" });
      }

      // Check if the listing is already saved
      const existingSave = await db.collection("saved").findOne({
        userId,
        listingId: listingIdStr
      });

      if (existingSave) {
        return res.status(400).json({ error: "Listing already saved" });
      }

      await db.collection("saved").insertOne({
        userId,
        listingId: listingIdStr,
        createdAt: new Date(),
      });
      return res.status(201).json({ message: "Listing saved successfully" });
    } catch (error) {
      console.error("Error saving listing:", error);
      return res.status(500).json({ error: "Failed to save listing" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { listingId } = req.body;
      const client = await clientPromise;
      const db = client.db("uta-housing");

      // Convert listingId to string
      const listingIdStr = String(listingId);

      await db.collection("saved").deleteOne({
        userId,
        listingId: listingIdStr
      });
      return res.status(200).json({ message: "Listing removed successfully" });
    } catch (error) {
      console.error("Error removing saved listing:", error);
      return res.status(500).json({ error: "Failed to remove saved listing" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
} 