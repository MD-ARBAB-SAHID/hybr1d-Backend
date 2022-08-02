const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const {addProducts,getOrders} = require("../controllers/sellers-controllers")

router.post("/add-product",[check("name").not().isEmpty(),check("price").not().isEmpty()],addProducts)
router.get("/orders",getOrders)

module.exports = router;
