const { getDatabase } = require("./lib/mongo");

module.exports = async function handler(req, res) {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });

    return res.status(200).json({
      ok: true,
      msg: "Conectado ao MongoDB"
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      erro: err && err.message ? err.message : String(err)
    });
  }
};