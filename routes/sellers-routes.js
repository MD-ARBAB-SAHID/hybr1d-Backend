const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const {addProducts,getOrders} = require("../controllers/sellers-controllers")
//Seller Routes


//For adding a product
router.post("/add-product",[check("name").not().isEmpty(),check("price").not().isEmpty()],addProducts)

//For Retrieving product details
router.get("/orders",getOrders)

module.exports = router;
