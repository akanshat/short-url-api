const { ObjectID } = require("mongodb");

function generateRandomKey() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports.shortenOriginal = async (req, res, db) => {
  const { originalUrl } = req;
  if (!originalUrl) return res.status(400).json({ error: "Invalid Content" });

  const checkUrl = await db.collection("url").findOne({ originalUrl });

  if (checkUrl)
    return res.status(302).json({ message: "Url already exists", checkUrl });
  else {
    const key = generateRandomKey();
    await db.collection("url").insertOne({
      originalUrl,
      key,
    });
    return res.status(201).json(key);
  }
};

module.exports.redirectToOriginal = async (req, res, db) => {
  const { key } = req.query;
  if (!key) return res.status(404).json({ error: "Invalid url" });

  const original = await db.collection("url").findOne({ key });

  if (!original) return res.status(404).json({ error: "Url not found" });
  else {
    return res.status(302).json(original);
  }
};

module.exports.showAllRecords = async (res, db) => {
  const allRecords = await db.collection("url").findAll({});
  return res.status(200).json(allRecords)
};
