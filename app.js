const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
var morgan = require("morgan");
const url = "mongodb://localhost/Secure";
const app = express();

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  const con = mongoose.connection;

  con.on("open",()=>{
    console.log("DATABASE CONNECTED...");
  });

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

const textRouter = require("./routes/texts");
app.use("/copvoid", textRouter);

app.listen(3000, () => {
  console.log("SERVER STARTED");
});
