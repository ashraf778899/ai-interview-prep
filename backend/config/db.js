const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_interview_db', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.error(`👉 Tip: Make sure local MongoDB is running, OR add your free MongoDB Atlas URI in backend/.env:`);
    console.error(`   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai_interview_db\n`);
  }
};

module.exports = connectDB;
