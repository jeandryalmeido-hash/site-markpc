const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("A variável de ambiente MONGODB_URI não foi definida.");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

async function getDatabase() {
  const clientConectado = await clientPromise;
  const db = clientConectado.db("markpc");
  return db;
}

module.exports = { getDatabase };