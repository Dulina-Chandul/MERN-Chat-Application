import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);

    console.log("Database connected" + conn.connection.host);
  } catch (error) {
    console.log("Error while connecting to database: " + error.message);
    process.exit(1);
  }
};

export default connectDB;
