const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Seller = require("../models/Sellers");
const HttpError = require("../models/http-error");
const Catalog = require("../models/Catalogs");
const Order = require("../models/Orders");
const Product = require("../models/Products");

const addProducts = async (req, res, next) => {
  let existingSeller;
  const userId = req.userData.userId;
  const errors = validationResult(req);

  //checking for validation errors
  if (!errors.isEmpty())
    return next(
      new HttpError("Invalid inputs passed,please check your inputs", 406)
    );

  const { name, price } = req.body;

  //finding seller in database
  try {
    existingSeller = await Seller.findById(userId).populate("catalog");
  } catch (err) {
    return next(new HttpError("Something went wrong,try again", 500));
  }

  // if seller is not found

  if (!existingSeller) return next(new HttpError("Seller not found", 404));

  //creating product object

  const product = new Product({
    name: name,
    price: price,
    seller: userId,
  });

  //saving product and adding product id to the seller's catalog
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.save({ session: sess });
    existingSeller.catalog.products.push(product);
    await existingSeller.catalog.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Could not add product to catalog,try again", 500)
    );
  }

  return res
    .status(201)
    .json({ message: "Product Added Successfully ", product: product });
};

const getOrders = async (req, res, next) => {
  const userId = req.userData.userId;
  let existingSeller;
  //finding seller in database
  try {
    existingSeller = await Seller.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong,try again", 500));
  }

  // if seller is not found
  if (!existingSeller) return next(new HttpError("Seller not found", 404));

  //fetching all orders
  let orders;
  try {
    orders = await Order.find({ seller: userId })
      .populate({ path: "buyer", select: "name email" })
      .populate({ path: "products", select: "name price" });
  } catch (err) {
    return next(new HttpError("Something went wrong,try again", 500));
  }

  return res.status(200).json(orders);
};

exports.addProducts = addProducts;
exports.getOrders = getOrders;
