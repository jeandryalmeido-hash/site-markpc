const { getDatabase } = require("./lib/mongo");
const { ObjectId } = require("mongodb");

module.exports = async function handler(req, res) {
  try {
    const db = await getDatabase();
    const { id } = req.query;

    await db.collection("servicos").deleteOne({
      _id: new ObjectId(id)
    });

    return res.status(200).json({
      ok: true,
      msg: "Serviço deletado com sucesso"
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      erro: err.message
    });
  }
};