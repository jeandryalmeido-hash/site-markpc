import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db("meubanco");

    if (req.method === "POST") {
      const data = req.body;

      await db.collection("clientes").insertOne({
        ...data,
        criadoEm: new Date(),
      });

      return res.status(200).json({ ok: true });
    }

    if (req.method === "GET") {
      const dados = await db.collection("clientes").find().toArray();
      return res.status(200).json(dados);
    }

  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}