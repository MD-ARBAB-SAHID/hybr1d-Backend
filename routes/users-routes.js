const express = require("express");
const router = express.Router();
const {register,login} = require("../controllers/users-controller")
const {check} = require("express-validator");



//register route
router.post("/register",[check("name").not().isEmpty(),check("email").isEmail(),check("password").isLength({min:5}),check('type').notEmpty().custom((value, { req }) => {

    //checking if selected type is buyer or seller
if ( value!='buyer' && value!='seller') {
 throw new Error('Type for the user not selected');

    }
    return true;
  })],register);

//login route
router.post("/login",login);


module.exports = router;


