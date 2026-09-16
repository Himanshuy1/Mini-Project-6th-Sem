import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

    console.log('--- MongoDB URI Debug Info ---');
    console.log('URI first 25 chars:', uri?.slice(0, 25));
    console.log('URI last 20 chars:', uri?.slice(-20));
    console.log('URI length:', uri?.length);
    console.log('------------------------------');

    if (!uri) {
      console.error('[DB] FATAL: No MongoDB URI found in environment variables.');
      console.error('[DB] Please set MONGO_URI or MONGODB_URI in your Render environment variables.');
      process.exit(1);
    }

    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Fail fast (10s) instead of hanging for 30s
      socketTimeoutMS: 45000,
    });

    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Connection Error: ${error.message}`);
    console.error('[DB] Full error:', error);
    process.exit(1);
  }
};

export default connectDB;
