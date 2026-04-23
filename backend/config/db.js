const mongoose = require('mongoose');

const connectDB = async (retries = 3) => {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`🔄 MongoDB connection attempt ${i}/${retries}...`);
      const conn = await mongoose.connect(process.env.MONGODB_URI.trim(), {
        family: 4,
        serverSelectionTimeoutMS: 15000
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      break;
    } catch (error) {
      console.error(`❌ Attempt ${i} failed: ${error.message}`);
      if (i === retries) {
        console.error('💀 All connection attempts failed. Exiting.');
        process.exit(1);
      }
      console.log(`⏳ Retrying in 3 seconds...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB runtime error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
};

module.exports = connectDB;
