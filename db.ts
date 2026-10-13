import mongoose from 'mongoose';

let isMongoConnected = false;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('[DB] No MONGODB_URI configured in environment. Utilizing in-memory resilient store with sample datasets.');
    return false;
  }

  try {
    // Attempt connection with short timeout so it doesn't hang if no local mongod
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log('[DB] Successfully connected to MongoDB database.');
    return true;
  } catch (error) {
    console.warn('[DB] MongoDB connection attempt timed out or failed. Defaulting safely to local resilient database store.');
    isMongoConnected = false;
    return false;
  }
}

export function isConnected(): boolean {
  return isMongoConnected;
}
