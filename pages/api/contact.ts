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
    const collection = database.collection('contact');

    const contactData = {
      ...req.body,
      createdAt: new Date(),
      // Store user information
      userId: req.body.userId,
      // Store contact details
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    };

    const result = await collection.insertOne(contactData);
    
    return res.status(200).json({ 
      message: 'Message sent successfully',
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Error sending message' });
  } finally {
    await client.close();
  }
} 