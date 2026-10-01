const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shortlink_biohub';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of hanging
    });
    
    console.log(`\n==================================================`);
    console.log(`[MongoDB] Connected Successfully!`);
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`MongoDB Compass Connection URI: ${uri}`);
    console.log(`==================================================\n`);
  } catch (error) {
    console.error(`\n==================================================`);
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.error(`--------------------------------------------------`);
    console.error(`Tips to connect with MongoDB Compass / Local MongoDB:`);
    console.error(`1. Ensure MongoDB service is running on your Windows machine.`);
    console.error(`   (Open Services -> MongoDB Server -> Start)`);
    console.error(`2. Open MongoDB Compass and connect to: mongodb://127.0.0.1:27017`);
    console.error(`3. The database 'shortlink_biohub' will be created automatically upon signup!`);
    console.error(`==================================================\n`);
    // Do not exit process immediately so server stays up and reports API status
  }
};

module.exports = connectDB;
