const { getDatabase } = require("./lib/mongo");

module.exports = async (req, res) => {
  try {
    const db = await getDatabase();
    const data = JSON.parse(req.body);

    await db.collection("produtos").insertOne(data);

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};