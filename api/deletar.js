const { getDatabase } = require("./lib/mongo");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  try {
    const db = await getDatabase();
    const { id } = req.query;

    await db.collection("produtos").deleteOne({
      _id: new ObjectId(id),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};