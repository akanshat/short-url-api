const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
});

const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
