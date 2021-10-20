const express = require("express");
const router = express.Router();
const Text = require("../models/cop_schema");
var cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const NodeRSA = require("node-rsa");
const buffer = require("buffer");

//signup for cop by generating key pair

router.post("/signup", (req, res, next) => {
  // generate key pair after successful registration
  crypto.generateKeyPair(
    "rsa",
    {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    },
    (err, publickey, privatekey) => {
      if (!err) {
        console.log("Public key is: ", publickey);
        console.log("Private key is: ", privatekey);
        private = privatekey;
        public = publickey;

        const newUser = new Text({
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 10),
          publicKey: public,
          privateKey: private,
        });

        const algorithm = "SHA256";
        const data = Buffer.from(req.body.username);
        const signature = crypto.sign(algorithm, data, private);
        const strbuf = signature.toString("base64");
        const bufstr = Buffer(strbuf, "base64");
        const isVerified = crypto.verify(algorithm, data, public, bufstr);
        console.log(isVerified);
        newUser.save((err) => {
          if (err) {
            return res.status(400).json({
              title: "error",
              error: "username in use",
            });
          }
          return res.status(200).json({
            title: "signup success, keys generated",
            public: public,
            private: private,
            username: req.body.username,
            sign: signature.toString("base64"),
          });
        });
      } else {
        console.log(err);
      }
    }
  );
});

//Login for the cop

router.post("/login", (req, res, next) => {
  Text.findOne({ username: req.body.username }, (err, user) => {
    if (err)
      return res.status(500).json({
        title: "server error",
        error: err,
      });
    if (!user) {
      return res.status(401).json({
        title: "user not found",
        error: "invalid credentials",
      });
    }
    //incorrect password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        tite: "login failed",
        error: "invalid credentials",
      });
    }
    //IF ALL IS GOOD create a token and send to frontend
    console.log(user.publicKey);
    let token = jwt.sign({ userId: user._id }, "secretkey");
    return res.status(200).json({
      title: "login sucess",
      token: token,
      public_key: user.publicKey,
    });
  });
});

//login using file upload
router.post("/file_authentication", (req, res) => {
  Text.findOne({ username: req.body.username }, (err, user) => {
    if (err)
      return res.status(500).json({
        title: "server error",
        error: err,
      });
    if (!user) {
      return res.status(401).json({
        title: "user not found",
        error: "invalid credentials",
      });
    }
    //decrypting file content with public key
    var public = user.publicKey;
    const algorithm = "SHA256";
    const data = Buffer.from(req.body.username);
    console.log(public);
    console.log(file);
    // decrypted_text = crypto.publicDecrypt(public, Buffer.from(file, "base64"));
    // console.log(decrypted_text.toString());
    var file = req.body.file_content;
    const bufstr = Buffer(file, "base64");
    const isVerified = crypto.verify(algorithm, data, public, bufstr);
    console.log(isVerified);
    if (isVerified) {
      console.log(user.publicKey);
      let token = jwt.sign({ userId: user._id }, "secretkey");
      return res.status(200).json({
        title: "login sucess",
        token: token,
        public_key: user.publicKey,
      });
    }
  });
});

router.get("/cops", async (req, res) => {
  try {
    const texts = await Text.find();
    // res.send(decrypted_text.toString())
    res.json(texts);
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
