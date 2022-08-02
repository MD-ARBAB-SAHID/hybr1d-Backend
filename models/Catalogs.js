const mongoose = require("mongoose");

//Catalog Schema for Catalogs
const catalogSchema = new mongoose.Schema({

    seller:{type:mongoose.Types.ObjectId,required:true,ref:"Seller"},
    products:[{type:mongoose.Types.ObjectId,required:true,ref:"Product",default:[]}]

});


module.exports = mongoose.model("Catalog",catalogSchema);