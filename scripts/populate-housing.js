const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://vercel-admin-user-67b38b9b9f500e1743ab711a:o2XeFRKw0XZgnujX@cse-3311.cvflx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const housingData = [
  {
    title: "Arlington Hall",
    location: { lat: 32.7296, lng: -97.1153 },
    description: "Traditional dormitory with shared rooms",
    price: 800,
    type: "Dormitory",
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Laundry", "Study Rooms"]
  },
  {
    title: "KC Hall",
    location: { lat: 32.7298, lng: -97.1155 },
    description: "Modern residence hall with suite-style rooms",
    price: 900,
    type: "Dormitory",
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Gym", "Kitchen"]
  },
  {
    title: "Vandergriff Hall",
    location: { lat: 32.7294, lng: -97.1151 },
    description: "Apartment-style living for upperclassmen",
    price: 1000,
    type: "Apartment",
    bedrooms: 4,
    bathrooms: 2,
    amenities: ["WiFi", "Kitchen", "Living Room"]
  },
  {
    title: "West Hall",
    location: { lat: 32.7292, lng: -97.1157 },
    description: "Freshman residence hall with community spaces",
    price: 850,
    type: "Dormitory",
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Study Rooms", "Community Kitchen"]
  },
  {
    title: "Arbor Oaks",
    location: { lat: 32.7299, lng: -97.1159 },
    description: "Off-campus apartments with modern amenities",
    price: 1200,
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Pool", "Gym", "Parking"]
  }
];

async function populateHousing() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    // Clear existing data
    await db.collection('housing').deleteMany({});
    
    // Insert new data
    const result = await db.collection('housing').insertMany(housingData);
    console.log(`Successfully inserted ${result.insertedCount} housing documents`);
  } catch (error) {
    console.error('Error populating housing:', error);
  } finally {
    await client.close();
  }
}

populateHousing(); 