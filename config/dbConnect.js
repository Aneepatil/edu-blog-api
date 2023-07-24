import mongoose from 'mongoose'
// import dotenv from 'dotenv'
// dotenv.config()

// Connect to MongoDB
export const dbConnect = async () => {
    try {
      await mongoose.connect(process.env.MONGOURL);
      console.log('MongoDB connection successful...');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };