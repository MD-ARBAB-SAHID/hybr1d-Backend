const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  getSellersList,
  getSellerCatalog,
  addOrder,
} = require("../controllers/buyers-controller");

//route for getting list of sellers
router.get("/list-of-sellers", getSellersList);

//route for getting catalog for specific seller
router.get("/seller-catalog/:seller_id", getSellerCatalog);

//route for making an order
router.post("/create-order/:seller_id", addOrder);

module.exports = router;
