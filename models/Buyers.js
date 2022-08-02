const mongoose = require("mongoose");

// Buyer Schema
const buyerSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:5},

})



module.exports = mongoose.model("Buyer",buyerSchema);