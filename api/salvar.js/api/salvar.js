const { getDatabase } = require("./_lib/mongo");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido." });
  }

  try {
    const {
      nome,
      categoria,
      imagem,
      descricao,
      preco,
      precoPromocional,
      linkCompra,
      destaque,
      oculto,
      emEstoque
    } = req.body || {};

    if (!nome || !categoria) {
      return res.status(400).json({
        erro: "Os campos nome e categoria são obrigatórios."
      });
    }

    const produto = {
      nome: String(nome).trim(),
      categoria: String(categoria).trim(),
      imagem: imagem ? String(imagem).trim() : "",
      descricao: descricao ? String(descricao).trim() : "",
      preco: preco !== "" && preco !== undefined ? Number(preco) : null,
      precoPromocional:
        precoPromocional !== "" && precoPromocional !== undefined
          ? Number(precoPromocional)
          : null,
      linkCompra: linkCompra ? String(linkCompra).trim() : "",
      destaque: Boolean(destaque),
      oculto: Boolean(oculto),
      emEstoque: Boolean(emEstoque),
      criadoEm: new Date()
    };

    const db = await getDatabase();
    const resultado = await db.collection("produtos").insertOne(produto);

    return res.status(201).json({
      mensagem: "Produto salvo com sucesso.",
      id: resultado.insertedId
    });
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    return res.status(500).json({ erro: "Erro interno ao salvar produto." });
  }
};