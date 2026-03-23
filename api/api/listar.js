const { getDatabase } = require("./_lib/mongo");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ erro: "Método não permitido." });
  }

  try {
    const db = await getDatabase();
    const produtos = await db
      .collection("produtos")
      .find({})
      .sort({ criadoEm: -1 })
      .toArray();

    return res.status(200).json({ produtos });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return res.status(500).json({ erro: "Erro interno ao listar produtos." });
  }
};