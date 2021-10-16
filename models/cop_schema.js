const mongoose = require("mongoose");

const copSchema = new mongoose.Schema({
  username: {
    unique: true,
    type: String,
  },
  password: {
    type: String,
  },
  publicKey: {
    type: String,
  },
  privateKey: {
    type: String,
  },
});

module.exports = mongoose.model("Text", copSchema);
