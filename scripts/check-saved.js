const { MongoClient } = require('mongodb');

async function checkSavedListings() {
  const uri = "mongodb+srv://vercel-admin-user-67b38b9b9f500e1743ab711a:o2XeFRKw0XZgnujX@cse-3311.cvflx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
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