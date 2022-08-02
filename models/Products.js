const mongoose = require("mongoose");

//Product schema for catalog products
const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:String,required:true},
    seller:{type:mongoose.Types.ObjectId,required:true,ref:"Seller"}
})



module.exports = mongoose.model("Product",productSchema);