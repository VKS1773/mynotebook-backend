const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
var fetchuser = require("../middleware/fetchuser");
var jwt = require("jsonwebtoken");

const JWT_SECRET = "youaredoinggood";

//create user using :post '/api/auth/creatuser' no login required
router.post(
  "/createuser",
  [
    body("name", "enter a valide name").isLength({ min: 3 }),
    body("email", "enter a valid mail").isEmail(),
    body("password", "passowr dshould be at least 5 character ").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //if there are errors return all errors here
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //check email already exit or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "email already exist" });
      }

      //secure password
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      //create user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });

      // .then(user => res.json(user)).catch(err=>{console.log(err)
      // res.json({error:"please enter a unuique value ",message:err.message})});
      //  res.json(user)
    } catch (error) {
      console.error(error.message);
      //if any error occured then this code is run
      res.status(500).send("Internal error occured ");
    }
  }
);

//Authenticate a user using:post '/api/auth/login'. No login required

router.post(
  "/login",
  [
    body("email", "enter a valid mail").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    //if there are errors return all errors here
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          success,
          errors: "please try to login with correct credentials",
        });
      }
      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        success = false;
        return res.status(400).json({
          success,
          errors: "please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      //if any error occured then this code is run
      res.status(500).send("Internal eroor occured ");
    }
  }
);

// Get loggidin detail of user using :post:-'/api/auth/getuser
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-passwor");
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    //if any error occured then this code is run
    res.status(500).send("Internal eroor occured ");
  }
});
module.exports = router;
