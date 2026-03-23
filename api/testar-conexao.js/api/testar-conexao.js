const { getDatabase } = require("./_lib/mongo");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ erro: "Método não permitido." });
  }

  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });

    return res.status(200).json({
      mensagem: "Conexão com MongoDB funcionando."
    });
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return res.status(500).json({
      erro: "Não foi possível conectar ao MongoDB."
    });
  }
};