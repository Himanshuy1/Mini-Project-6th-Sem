import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

    console.log('--- MongoDB URI Debug Info ---');
    console.log('URI first 25 chars:', uri?.slice(0, 25));
    console.log('URI last 20 chars:', uri?.slice(-20));
    console.log('URI length:', uri?.length);
    console.log('------------------------------');

    const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/global_news_ai');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
