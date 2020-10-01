"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

mongoose.Promise = global.Promise;

const dotenv = require("dotenv");
dotenv.config();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use(express.json());

var port = process.env.PORT || 3001;
var url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connection to db established"));

// app.post("/api/shorten", (req, res, urlModel) => {
//   shortenOriginal(req, res, urlModel);
// });

// app.get("/api/shortUrl/:key", (req, res, db) => {
//   redirectToOriginal(req, res, db);
// });

const urlRouter = require("./routes/url.route");
app.use("/api", urlRouter);

app.listen(port, () => {
  console.log(`server listening at ${port}`);
});
