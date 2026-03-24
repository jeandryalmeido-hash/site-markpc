const { getDatabase } = require("./lib/mongo");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        ok: false,
        erro: "Método não permitido"
      });
    }

    const db = await getDatabase();

    const data =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    await db.collection("servicos").insertOne({
      nome: data.nome || "",
      descricao: data.descricao || "",
      imagem: data.imagem || "",
      valor: data.valor || "",
      link: data.link || "",
      destaque: !!data.destaque,
      criadoEm: new Date()
    });

    return res.status(200).json({
      ok: true,
      msg: "Serviço salvo com sucesso"
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      erro: err.message
    });
  }
};