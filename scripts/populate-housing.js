const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://vercel-admin-user-67b38b9b9f500e1743ab711a:o2XeFRKw0XZgnujX@cse-3311.cvflx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const housingData = [
  {
    id: "1",
    title: "Arlington Hall",
    location: { lat: 32.7296, lng: -97.1153 },
    description: "Traditional dormitory with shared rooms",
    price: 800,
    type: "Residence Hall",
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["Wi-Fi", "Fitness Center", "Pool"],
    rating: 4.5
  },
  {
    id: "2",
    title: "KC Hall",
    location: { lat: 32.7298, lng: -97.1155 },
    description: "Modern residence hall with suite-style rooms",
    price: 900,
    type: "Residence Hall",
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["Parking", "Study Rooms", "Laundry"],
    rating: 4.2
  },
  {
    id: "4",
    title: "Vandergriff Hall",
    location: { lat: 32.7294, lng: -97.1151 },
    description: "Apartment-style living for upperclassmen",
    price: 850,
    type: "Residence Hall",
    bedrooms: 4,
    bathrooms: 2,
    amenities: ["Shuttle Service", "Utilities Included", "Furnished"],
    rating: 4.3
  },
  {
    id: "5",
    title: "West Hall",
    location: { lat: 32.7292, lng: -97.1157 },
    description: "Freshman residence hall with community spaces",
    price: 700,
    type: "Residence Hall",
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["On-Campus", "Meal Plan", "24/7 Support"],
    rating: 4.1
  },
  {
    id: "6",
    title: "Arbor Oaks",
    location: { lat: 32.7300, lng: -97.1160 },
    description: "Off-campus apartments with modern amenities",
    price: 720,
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Study Lounge", "Community Events", "AC"],
    rating: 4.4
  },
  {
    id: "7",
    title: "The Heights on Pecan",
    location: { lat: 32.7302, lng: -97.1162 },
    description: "Modern apartment complex near campus",
    price: 720,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["Study Lounge", "Community Events", "AC"],
    rating: 4.4
  },
  {
    id: "8",
    title: "The Lofts",
    location: { lat: 32.7304, lng: -97.1164 },
    description: "Contemporary living spaces for students",
    price: 720,
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Study Lounge", "Community Events", "AC"],
    rating: 4.4
  },
  {
    id: "9",
    title: "Meadow Run",
    location: { lat: 32.7306, lng: -97.1166 },
    description: "Comfortable student apartments",
    price: 720,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Study Lounge", "Community Events", "AC"],
    rating: 4.4
  },
  {
    id: "10",
    title: "Timber Brook",
    location: { lat: 32.7308, lng: -97.1168 },
    description: "Quiet residential community",
    price: 720,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["Study Lounge", "Community Events", "AC"],
    rating: 4.4
  },
  {
    id: "11",
    title: "University Village",
    location: { lat: 32.7310, lng: -97.1170 },
    description: "Vibrant student community",
    price: 720,
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Study Lounge", "Community Events", "AC"],
    rating: 4.4
  },
  {
    id: "12",
    title: "Centennial Court",
    location: { lat: 32.7312, lng: -97.1172 },
    description: "Privately owned student housing",
    price: 720,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Study Lounge", "Community Events", "AC"],
    rating: 4.4
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