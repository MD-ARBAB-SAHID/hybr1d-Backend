const express = require("express");
const { check } = require("express-validator");
const { register, login } = require("../controllers/users-controller");

const router = express.Router();

//register route
router.post(
  "/register",
  [
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 5 }),
    check("type")
      .notEmpty()
      .custom((value, { req }) => {
        //checking if selected type is buyer or seller
        if (value != "buyer" && value != "seller") {
          throw new Error("Type for the user not selected");
        }
        return true;
      }),
  ],
  register
);

//login route
router.post("/login", login);

module.exports = router;
