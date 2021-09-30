const mongoose = require("mongoose");


const copSchema = new mongoose.Schema({
    username: {
      unique: true,
      type: String,
    },
    password:{
        type: String
    },
    texts: [{ text: String }],
  });
  
  module.exports = mongoose.model("Text", copSchema);