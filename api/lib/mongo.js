const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL;

if (!uri) {
  throw new Error("MONGO_URL não definida");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

async function getDatabase() {
  const client = await clientPromise;
  return client.db("markpc");
}

module.exports = { getDatabase };