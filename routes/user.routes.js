const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* /user/test */
// router.get("/test", (req, res) => {
//   res.send("User Test router");
// });

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post(
  "/register",
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Invalid Data",
      });
    }

    const { username, email, password } = req.body;
    /* Hashed password -> we don't save password directly (naked) in the db bcz what if db got comprosmized and then hacker 
   will get all the accounts access -> hence we hashed it using bcrypt and then save it in the db */

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      email,
      username,
      password: hashedPassword,
    });

    res.json(newUser);

    // console.log(req.body);
    // res.send("User Register");
  }
);

router.get("/login", (req, res) => {
  // res.send("Loging Route API");
  res.render("login.ejs");
});

router.post(
  "/login",
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    // Valdiation fail -> Show errors (Email or password is wronge)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: errors.array(), message: "Invalid Data" });
    }
    // if Validation pass -> Login User
    const { username, password } = req.body;
    // find user in db
    const user = await userModel.findOne({
      username: username,
    });

    if (!user) {
      return res.status(400).json({
        message: "Username or password is incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    // generate token - if username and password is valid
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET
    );

    // we don't send token directly in the response
    /*res.json({
     token,
   }); */

    // we send token through cookies in the response

    res.cookie("token", token);

    res.send("Logged In");
  }
);

module.exports = router;
