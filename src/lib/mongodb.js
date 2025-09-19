import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'chatbot-maker';

// Only validate MongoDB URI in runtime, not during build
if (!MONGODB_URI && process.env.NODE_ENV !== 'production') {
  console.warn('MongoDB URI not found. Some features may not work.');
}

let client;
let clientPromise;

if (MONGODB_URI) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
  }
}

export default clientPromise;

export async function getDatabase() {
  if (!MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }
  const client = await clientPromise;
  return client.db(MONGODB_DB);
}

export async function getCollection(collectionName) {
  if (!MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }
  const db = await getDatabase();
  return db.collection(collectionName);
}
