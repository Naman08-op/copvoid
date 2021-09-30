const express = require("express");
const router = express.Router();
const Text = require("../models/cop_schema");
var cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

router.post("/", async (req,res)=>{
    const text = new Text({
        username: req.body.username,
        password: req.body.password,
        texts: req.body.texts
    });
    try {
        const a1 = await text.save();
        res.json(a1);
      } catch (err) {
        res.send("ERROR" + err);
      }
});

router.get("/", async (req, res) => {
    try {
      const texts = await Text.find(); 
      res.json(texts);
    } catch (err) {
      res.send("Error " + err);
    }
  });

//Signup for cop

router.post('/signup', (req, res, next) => {
  const newUser = new Text({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  newUser.save(err => {
    if (err) {
      return res.status(400).json({
        title: 'error',
        error: 'username in use'
      })
    }
    return res.status(200).json({
      title: 'signup success'
    })
  })
})

//Login for the cop

router.post('/login', (req, res, next) => {
    Text.findOne({ username: req.body.username }, (err, user) => {
      if (err) return res.status(500).json({
        title: 'server error',
        error: err
      })
      if (!user) {
        return res.status(401).json({
          title: 'user not found',
          error: 'invalid credentials'
        })
      }
      //incorrect password
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          tite: 'login failed',
          error: 'invalid credentials'
        })
      }
      //IF ALL IS GOOD create a token and send to frontend
      let token = jwt.sign({ userId: user._id}, 'secretkey');
      return res.status(200).json({
        title: 'login sucess',
        token: token
      })
    })
  })

//For sending messages to msg room from a particular cop

router.post("/sendmsg", (req, res) => {
    Text.updateOne(
      { _id: req.body._id },
      { $push: { texts: req.body.texts } },
      { safe: true, upsert: true },
      (err, user) => {
        if (err) {
          return console.log(err);
        } else {
          return res.status(200).json({
            title: "user grabbed",
            user: {
              texts: user.texts,
            },
          });
          console.log(user.texts);
          // res.json({result});
        }
      }
    );
  });


module.exports = router;