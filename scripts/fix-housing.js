const { MongoClient } = require('mongodb');

async function fixHousingListings() {
  const uri = "mongodb+srv://vercel-admin-user-67b38b9b9f500e1743ab711a:o2XeFRKw0XZgnujX@cse-3311.cvflx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('uta-housing');
    const housingCollection = db.collection('housing');

    // Delete the incomplete Centennial Court listing
    const deleteResult = await housingCollection.deleteOne({
      image: '/Assets/Centennial.jpg',
      amenities: ['Study Lounge', 'Community Events', 'AC'],
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 850
    });

    console.log('Delete result:', deleteResult);

    // Insert the complete Centennial Court listing
    const insertResult = await housingCollection.insertOne({
      id: '12',
      title: 'Centennial Court (Privately Owned)',
      description: 'Arlington, TX',
      price: 720,
      location: 'Arlington, TX',
      rating: 4.4,
      image: '/Assets/Centennial.jpg',
      amenities: ['Study Lounge', 'Community Events', 'AC'],
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 850
    });

    console.log('Insert result:', insertResult);

  } catch (error) {
    console.error('Error fixing housing listings:', error);
  } finally {
    await client.close();
  }
}

fixHousingListings(); 