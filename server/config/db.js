const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      tlsAllowInvalidCertificates: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Notice: ${error.message}`);
    console.log('Backend is running, but database connection is pending. Please verify MongoDB is running locally on port 27017 or provide your MongoDB Atlas URI in server/.env.');
  }
};

module.exports = connectDB;
