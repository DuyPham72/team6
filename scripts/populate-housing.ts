import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

const housingListings = [
  {
    id: "1",
    title: "Arlington Hall",
    description: "Arlington, TX",
    price: 800,
    location: "Arlington, TX",
    rating: 4.5,
    image: "/Assets/Arlington_Hall.png",
    amenities: ["Wi-Fi", "Fitness Center", "Pool"],
    type: "Residence Hall",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 650
  },
  {
    id: "2",
    title: "KC Hall",
    description: "Arlington, TX",
    price: 900,
    location: "Arlington, TX",
    rating: 4.2,
    image: "/Assets/KC_Hall.png",
    amenities: ["Parking", "Study Rooms", "Laundry"],
    type: "Residence Hall",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 700
  },
  {
    id: "4",
    title: "Vandergriff Hall",
    description: "Arlington, TX",
    price: 850,
    location: "Arlington, TX",
    rating: 4.3,
    image: "/Assets/Vandergriff_Hall.png",
    amenities: ["Shuttle Service", "Utilities Included", "Furnished"],
    type: "Residence Hall",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 600
  },
  {
    id: "5",
    title: "West Hall",
    description: "Arlington, TX",
    price: 700,
    location: "Arlington, TX",
    rating: 4.1,
    image: "/Assets/West_Hall.png",
    amenities: ["On-Campus", "Meal Plan", "24/7 Support"],
    type: "Residence Hall",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 550
  },
  {
    id: "6",
    title: "Arbor Oaks",
    description: "Arlington, TX",
    price: 720,
    location: "Arlington, TX",
    rating: 4.4,
    image: "/Assets/Arbor_Oaks.jpg",
    amenities: ["Study Lounge", "Community Events", "AC"],
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 600
  },
  {
    id: "7",
    title: "The Heights on Pecan",
    description: "Arlington, TX",
    price: 720,
    location: "Arlington, TX",
    rating: 4.4,
    image: "/Assets/Height_At_Pecan.png",
    amenities: ["Study Lounge", "Community Events", "AC"],
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 750
  },
  {
    id: "8",
    title: "The Lofts",
    description: "Arlington, TX",
    price: 720,
    location: "Arlington, TX",
    rating: 4.4,
    image: "/Assets/Loft.png",
    amenities: ["Study Lounge", "Community Events", "AC"],
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 620
  },
  {
    id: "9",
    title: "Meadow Run",
    description: "Arlington, TX",
    price: 720,
    location: "Arlington, TX",
    rating: 4.4,
    image: "/Assets/Medow_Run.png",
    amenities: ["Study Lounge", "Community Events", "AC"],
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 800
  },
  {
    id: "10",
    title: "Timber Brook",
    description: "Arlington, TX",
    price: 720,
    location: "Arlington, TX",
    rating: 4.4,
    image: "/Assets/Timber_Brook.png",
    amenities: ["Study Lounge", "Community Events", "AC"],
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 750
  },
  {
    id: "11",
    title: "University Village",
    description: "Arlington, TX",
    price: 720,
    location: "Arlington, TX",
    rating: 4.4,
    image: "/Assets/University_Village.png",
    amenities: ["Study Lounge", "Community Events", "AC"],
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 600
  },
  {
    id: "12",
    title: "Centennial Court (Privately Owned)",
    description: "Arlington, TX",
    price: 720,
    location: "Arlington, TX",
    rating: 4.4,
    image: "/Assets/Centennial.jpg",
    amenities: ["Study Lounge", "Community Events", "AC"],
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 850
  }
];

async function populateHousing() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db("uta-housing");
    
    // Clear existing data
    await db.collection("housing").deleteMany({});
    console.log("Cleared existing housing data");
    
    // Insert new data
    const result = await db.collection("housing").insertMany(housingListings);
    console.log(`Inserted ${result.insertedCount} housing listings`);
    
  } catch (error) {
    console.error("Error populating housing data:", error);
  } finally {
    await client.close();
  }
}

populateHousing(); 