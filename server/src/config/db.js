const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stayscape';

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[ERROR] Error connecting to MongoDB:`, error.message);
    process.exit(1);
  }
};

module.exports = connectDB;