const { MongoClient } = require("mongodb");

let clientPromise = global._mongoClientPromise || null;

function getMongoUri() {
  return process.env.MONGO_URL || process.env.MONGODB_URI || "";
}

async function getDatabase() {
  const uri = getMongoUri();

  if (!uri) {
    throw new Error("Nenhuma variável encontrada. Use MONGO_URL ou MONGODB_URI.");
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