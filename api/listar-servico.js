const { getDatabase } = require("./lib/mongo");

module.exports = async function handler(req, res) {
  try {
    const db = await getDatabase();

    const servicos = await db
      .collection("servicos")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    return res.status(200).json(servicos);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      erro: err.message
    });
  }
};