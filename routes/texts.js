const express = require("express");
const router = express.Router();
const Text = require("../models/cop_schema");
var cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateKeyPair } = require("crypto");
const NodeRSA = require('node-rsa');

//signup for cop by generating key pair

router.post("/signup", (req, res, next) => {
  //generate key pair after successful registration
  // generateKeyPair('rsa',{
  //     modulusLength: 4096,
  //     publicKeyEncoding:{
  //         type:'spki',
  //         format:'pem'
  //     },
  //     privateKeyEncoding:{
  //         type:'pkcs8',
  //         format:'pem',
  //         cipher:'aes-256-cbc',
  //         passphrase:'top secret'
  //     }
  // },(err,publickey,privatekey)=>{
  //     if(!err){
  //         console.log("Public key is: ", publickey);
  //         console.log("Private key is: ", privatekey);
  //         private= privatekey;
  //         public= publickey;

  //     }
  //     else{
  //         console.log(err)
  //     }
  const newUser = new Text({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    publicKey: req.body.publicKey,
    privateKey: req.body.privateKey,
  });
  newUser.save((err) => {
    if (err) {
      return res.status(400).json({
        title: "error",
        error: "username in use",
      });
    }
    return res.status(200).json({
      title: "signup success, keys generated",
    });
  });
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
    var file = req.body.file_content;
    console.log(public)
    console.log(file)
    // decrypted_text = crypto.publicDecrypt(public, Buffer.from(file, "base64"));
    // console.log(decrypted_text.toString());
    crypt.setKey(public)
    decrypted_text= crypt.decrypt(file)
  });
});

router.get("/", async (req, res) => {
  try {
    const texts = await Text.find();
    // res.send(decrypted_text.toString())
    res.json(texts);
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
