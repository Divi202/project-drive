const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
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
  (req, res) => {
    // const { username, email, password } = req.body();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Invalid Data",
      });
    }
    res.send(errors);
    // console.log(req.body);
    // res.send("User Register");
  }
);

module.exports = router;
