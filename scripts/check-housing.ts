import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function checkHousingListings() {
  try {
    await client.connect();
    const db = client.db("uta-housing");
    const listings = await db.collection("housing").find({}).toArray();
    console.log("Housing listings:", listings);
  } catch (error) {
    console.error("Error checking housing listings:", error);
  } finally {
    await client.close();
  }
}

checkHousingListings(); 