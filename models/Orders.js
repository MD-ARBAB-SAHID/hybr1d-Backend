const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    seller:{type:mongoose.Types.ObjectId,required:true,ref:'Seller'},
    products:[{type:mongoose.Types.ObjectId,required:true,ref:"Product"}],
    buyer:{type:mongoose.Types.ObjectId,required:true,ref:'Buyer'}

})



module.exports = mongoose.model("Order",orderSchema);