const { ObjectId } = require("mongodb");
const { getDatabase } = require("./_lib/mongo");

module.exports = async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ erro: "Método não permitido." });
  }

  try {
    const { id } = req.body || {};

    if (!id) {
      return res.status(400).json({ erro: "ID do produto é obrigatório." });
    }

    const db = await getDatabase();
    const resultado = await db.collection("produtos").deleteOne({
      _id: new ObjectId(id)
    });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    return res.status(200).json({ mensagem: "Produto excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return res.status(500).json({ erro: "Erro interno ao deletar produto." });
  }
};