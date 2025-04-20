import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('uta-housing');
    const housing = await db.collection('housing').find({}).toArray();

    // Transform the data to match the Location interface
    const locations = housing.map((h) => ({
      id: h._id.toString(),
      name: h.name,
      position: {
        lat: h.latitude,
        lng: h.longitude,
      },
      price: h.price,
      rating: h.rating,
      image: h.image,
      amenities: h.amenities || [],
      available: h.available || true,
    }));

    res.status(200).json(locations);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching housing data' });
  }
} 