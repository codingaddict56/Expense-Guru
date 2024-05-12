
const mongoose = require('mongoose');

const connectDB = async (req, res) => {
  const db = process.env.MONGO_URL;
  try {

    const { connection } = await mongoose.connect(db);
    console.log(`MongoDB Connected to ${connection.host}`);
  }
  catch (error) {
    console.log(`MongoDB Failed Connecting to ${connection.host} : ${error}`);
  }

}

module.exports = connectDB;