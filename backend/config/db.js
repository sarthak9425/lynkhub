const dns = require('dns');
const mongoose = require('mongoose');

// Fix MongoDB Atlas SRV DNS resolution issue
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/shortlink_biohub';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`\n==================================================`);
    console.log(`[MongoDB] Connected Successfully!`);
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

    // Detect actual MongoDB connection type
    if (conn.connection.host.includes('mongodb.net')) {
      console.log(`Connection Type: MongoDB Atlas`);
    } else {
      console.log(`Connection Type: Local MongoDB`);
    }

    console.log(`==================================================\n`);
  } catch (error) {
    console.error(`\n==================================================`);
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.error(`--------------------------------------------------`);
    console.error(`MongoDB connection failed.`);
    console.error(`Check your MONGODB_URI and MongoDB Atlas configuration.`);
    console.error(`==================================================\n`);

    // Keep server running
  }
};

module.exports = connectDB;