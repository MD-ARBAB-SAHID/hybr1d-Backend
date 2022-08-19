const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  catalog: { type: mongoose.Types.ObjectId, required: true, ref: "Catalog" },
});

sellerSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Seller", sellerSchema);
