import { MongoClient } from 'mongodb';

async function checkSavedListings() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('uta-housing');
    const savedCollection = db.collection('saved');
    const housingCollection = db.collection('housing');

    // Get all saved listings
    const savedListings = await savedCollection.find({}).toArray();
    console.log('Saved listings:', savedListings);

    // Get all housing listings
    const housingListings = await housingCollection.find({}).toArray();
    console.log('Housing listings:', housingListings);

  } catch (error) {
    console.error('Error checking saved listings:', error);
  } finally {
    await client.close();
  }
}

checkSavedListings(); 