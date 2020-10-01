const express = require("express");
const router = express.Router();
const Url = require("../models/url.model");
const { generateRandomKey } = require("../utils/key-generator");
const { validURL } = require("../utils/check-valid-url");

router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;
    console.log("originalUrl = ", originalUrl);
    if (!originalUrl || !validURL(originalUrl))
      throw new Error("Invalid Content");
    const checkUrl = await Url.find({ originalUrl });
    console.log("checkUrl = ", checkUrl);
    if (!checkUrl) throw new Error(`Url already exists ${checkUrl}`);
    const key = generateRandomKey();
    const urlItem = new Url({
      originalUrl,
      key,
    });
    const newUrlItem = await urlItem.save();
    res.status(201).json({ newUrlItem });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/shortUrl/:key", async (req, res, next) => {
  try {
    const { key } = req.params;
    const original = await Url.find({ key });

    if (original == null) throw new Error(`Url does not exist`);
    const url = original[0].originalUrl;
    res.status(200).json({ url });
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
