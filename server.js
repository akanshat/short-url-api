"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

const { shortenOriginal, redirectToOriginal } = require("./controllers/url");

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
const client = new MongoClient(url);

client.connect(function(err) {
  console.log("connected to the server");
  const db = client.db(dbName)
  client.close();
})


//   (error, client) => {
//     if (error) throw error;

//     const db = client.db(dbName);

//     app.post("/api/shorten", (req, res, db) => {
//       shortenOriginal(req, res, db);
//     });

//     app.get("/api/shortUrl/:key", (req, res, db) => {
//       redirectToOriginal(req, res, db);
//     });

//     app.listen(port, () => {
//       console.log(`server listening at ${port}`);
//     });
//   }
// );
