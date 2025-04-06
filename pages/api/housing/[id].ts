import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing listing ID' });
    }

    const client = await clientPromise;
    const db = client.db('uta-housing');
    
    // Convert id to string
    const listingId = String(id);
    
    // Find listing by string ID
    const listing = await db.collection('housing').findOne({ id: listingId });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Map the database fields to match the frontend interface
    const mappedListing = {
      ...listing,
      name: listing.title, // Map title to name
      price: `$${listing.price}/month`, // Format price
    };

    return res.status(200).json(mappedListing);
  } catch (error) {
    console.error('Error fetching housing listing:', error);
    return res.status(500).json({ error: 'Failed to fetch housing listing' });
  }
} 