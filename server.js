"use strict";

const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const shortId = require("shortid");
const validUrl = require("valid-url");
const app = express();

const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

var port = process.env.PORT || 3001;

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use(express.json());
app.use("/public", express.static(process.cwd() + "/public"));
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const Schema = mongoose.Schema;
const urlSchema = new Schema({
  original_url: String,
  short_url: String,
});

const URL = mongoose.model("URL", urlSchema);

app.post("/api/shorturl/new", async (req, res) => {
  const url = req.body.url_input;
  const urlCode = shortId.generate();
  if (!validUrl.isWebUri(url)) {
    res.status(401).json({
      error: "invalid URL",
    });
  } else {
    try {
      let findOne = await URL.findOne({ original_url: url });
      if (findOne) {
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url,
        });
      } else {
        findOne = new URL({
          original_url: url,
          short_url: urlCode,
        });
        await findOne.save();
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("server error.......");
    }
  }
});

app.get("/api/shorturl/:short_url?", async (req, res) => {
  try {
    const urlParams = await URL.findOne({
      short_url: req.params.short_url,
    });
    if (urlParams) {
      return res.redirect(urlParams.original_url);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("server error ......");
  }
});

app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello api" });
});

app.listen(port, () => {
  console.log(`server listening at ${port}`);
});
