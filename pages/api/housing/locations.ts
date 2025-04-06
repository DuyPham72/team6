import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const housingListings = await db.collection('housing').find({}).toArray();
    
    const locations = housingListings.map(listing => ({
      id: listing._id.toString(),
      title: listing.title,
      location: listing.location
    }));

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching housing locations:', error);
    res.status(500).json({ message: 'Error fetching housing locations' });
  }
} 