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

    await db.collection("produtos").insertOne({
      nome: data.nome || "",
      categoria: data.categoria || "",
      imagem: data.imagem || "",
      descricao: data.descricao || "",
      preco: data.preco || "",
      precoPromocional: data.precoPromocional || "",
      linkCompra: data.linkCompra || "",
      destaque: !!data.destaque,
      oculto: !!data.oculto,
      emEstoque: !!data.emEstoque,
      criadoEm: new Date()
    });

    return res.status(200).json({
      ok: true,
      msg: "Produto salvo com sucesso"
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      erro: err.message
    });
  }
};