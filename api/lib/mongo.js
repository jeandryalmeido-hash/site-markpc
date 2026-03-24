const { MongoClient } = require("mongodb");

let clientPromise = global._mongoClientPromise || null;

async function getDatabase() {
  const uri = process.env.MONGO_URL;

  if (!uri) {
    throw new Error("MONGO_URL não definida");
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    clientPromise = client.connect();
    global._mongoClientPromise = clientPromise;
  }

  const client = await clientPromise;
  return client.db("markpc");
}

module.exports = { getDatabase };