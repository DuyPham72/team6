import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await client.connect();
    const database = client.db('uta-housing');
    const collection = database.collection('feedback');

    const feedbackData = {
      ...req.body,
      createdAt: new Date(),
      // Store user information
      userId: req.body.userId,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      // Store feedback details
      type: req.body.type,
      details: req.body.details,
      additionalInfo: req.body.additionalInfo,
      isAnonymous: req.body.isAnonymous,
      // Store apartment information
      apartmentId: req.body.apartmentId,
      apartmentName: req.body.apartmentName,
    };

    const result = await collection.insertOne(feedbackData);
    
    return res.status(200).json({ 
      message: 'Feedback submitted successfully',
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ message: 'Error submitting feedback' });
  } finally {
    await client.close();
  }
} 