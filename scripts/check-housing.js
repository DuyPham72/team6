const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://vercel-admin-user-67b38b9b9f500e1743ab711a:o2XeFRKw0XZgnujX@cse-3311.cvflx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

async function checkHousing() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const housing = await db.collection('housing').find({}).toArray();
    
    console.log('Housing documents:', housing);
    console.log('Total documents:', housing.length);
    
    if (housing.length === 0) {
      console.log('No housing documents found. You may need to run the populate script.');
    }
  } catch (error) {
    console.error('Error checking housing:', error);
  } finally {
    await client.close();
  }
}

checkHousing(); 