const Buyer = require("../models/Buyers");
const Seller = require("../models/Sellers");
const Order = require("../models/Orders")
const HttpError = require("../models/http-error");
const Catalog = require("../models/Catalogs")
const mongoose = require("mongoose");
const {validationResult} = require("express-validator")

const getSellersList = async (req,res,next)=>{

const userId = req.userData.userId;
let existingBuyer;

  //finding buyer in database
  try{
    existingBuyer = await Buyer.findById(userId);    
}catch(err)
{
    return next(new HttpError("Something went wrong,try again",500));
   
}

// if buyer is not found
if(!existingBuyer)
return next(new HttpError("Could not get sellers ,try again",500));

let allSellers;
//getting all sellers
try{
    allSellers = await Seller.find({},{name:true,email:true});
}catch(err)
{
    return next(new HttpError("Something went wrong,try again",500));
}
return res.json(allSellers);

}
const getSellerCatalog = async (req,res,next)=>{

    const userId = req.userData.userId;
    const sellerId = req.params.seller_id;

    let existingBuyer;
    let existingSeller;
    
      //finding buyer in database
      try{
        existingBuyer = await Buyer.findById(userId);    
    }catch(err)
    {
        return next(new HttpError("Buyer Not Found",500));
       
    }

    
    // if buyer is not found
    if(!existingBuyer)
    return next(new HttpError("Buyer  Not Found",500));
    
    let sellerCatlog;

    //getting catalog of particular seller
    try{
        sellerCatlog = await Catalog.find({seller:sellerId}).populate({ path: 'products', select: 'name price' });
    }catch(err)
    {
        return next(new HttpError("Seller's catlog not found",500));
    }

    if(!sellerCatlog || sellerCatlog.length===0)
    {
        return next(new HttpError("Seller's catlog not found",500));
    }

    return res.json(sellerCatlog[0]);
    
    }

    const addOrder = async (req,res,next)=>{
        const userId = req.userData.userId;
        const sellerId = req.params.seller_id;
    
        let existingBuyer;
        let existingSeller;
        const {productsList} = req.body;

    //finding buyer in database
    try{
        existingBuyer = await Buyer.findById(userId);    
    }catch(err)
    {
        return next(new HttpError("Buyer Not Found",500));
       
    }

    //finding seller in database
    try{
        existingSeller = await Seller.findById(sellerId).populate("catalog");
    }catch(err)
    {
        return next(new HttpError("Seller's Catalog Not Found",500));
    }

    if(!existingBuyer)
    return next(new HttpError("Buyer Not Found",500));

    if(!existingSeller)
    return next(new HttpError("Seller  Not Found",500));

    const sellerProductsId = existingSeller.catalog.products;

    let checkProductsMatching = true;
    // checking if the products ordered by buyer belongs to one seller 
    for(let i=0;i<productsList.length;i++)
    {   let checkId = false;
        for(let j=0;j<sellerProductsId.length;j++)
        {
            if(productsList[i]===sellerProductsId[j].toString())
            {
                checkId = true;
                break;
            }
        }
        if(checkId===false)
        {
            checkProductsMatching = false;
            break;
        }
    }
    // if all products in productList does not match 
    if(checkProductsMatching===false)
    {
        return next(new HttpError("Product not found in seller's catalog",500));
    }
    
    //creating order
    const order = new Order({
        buyer:userId,
        seller:sellerId,
        products:productsList
    })

   
    try{
        await order.save();

    }catch(err){

    return next(new HttpError("Failed to place order,try again",500));
    }

return res.json({message:"Order placed .",order:order});


    }



exports.getSellersList = getSellersList;
exports.getSellerCatalog = getSellerCatalog
exports.addOrder = addOrder