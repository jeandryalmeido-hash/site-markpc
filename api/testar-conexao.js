const { getDatabase } = require("./lib/mongo");

module.exports = async (req, res) => {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });

    res.status(200).json({ ok: true, msg: "Conectado ao MongoDB 🚀" });
  } catch (err) {
    res.status(500).json({ ok: false, erro: err.message });
  }
};