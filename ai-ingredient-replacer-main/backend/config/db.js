require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb+srv://user2:user2@cluster0.tza4mdu.mongodb.net/myDatabase?retryWrites=true&w=majority";
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        // Don't use process.exit(1) in serverless functions
        throw error;
    }
};

module.exports = connectDB;
