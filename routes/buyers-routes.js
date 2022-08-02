const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const {getSellersList,getSellerCatalog,addOrder} = require("../controllers/buyers-controller")

router.get("/list-of-sellers",getSellersList);
router.get("/seller-catalog/:seller_id",getSellerCatalog);
router.post("/create-order/:seller_id",addOrder);
module.exports = router;