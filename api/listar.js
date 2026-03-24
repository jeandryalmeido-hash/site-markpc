const { getDatabase } = require("./lib/mongo");

module.exports = async function handler(req, res) {
  try {
    const db = await getDatabase();

    const produtos = await db
      .collection("produtos")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    return res.status(200).json({
      ok: true,
      produtos
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      erro: err.message
    });
  }
};