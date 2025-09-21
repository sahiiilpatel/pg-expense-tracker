import { MongoClient } from "mongodb";

let client;
let clientPromise;

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) throw new Error("Please add your MongoDB URI to .env");

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Log when connected
clientPromise
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

export default clientPromise;
