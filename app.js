const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
var morgan = require("morgan");
const url = "mongodb://localhost/SecureCop";
const app = express();

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("CONNECTED....");
});

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

// const todoRouter = require("./routes/todos");
app.use("/copvoid", todoRouter);

app.listen(3000, () => {
  console.log("SERVER STARTED");
});