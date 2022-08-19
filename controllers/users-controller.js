const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Catalog = require("../models/Catalogs")
const Buyer = require("../models/Buyers");
const Seller = require("../models/Sellers");



const register = async (req,res,next)=>{
    const errors = validationResult(req);
   
    //checking for validation errors
    if(!errors.isEmpty())

    return next(new HttpError("Invalid inputs passed,please check your inputs",406)) ;



    const {name,email,password,type} = req.body;
    let existingBuyer;
    let existingSeller;

    // checking if any user (buyer/seller) exist with same email id
    try{
        existingBuyer = await Buyer.findOne({email:email});
        existingSeller = await Seller.findOne({email:email});
        
    }catch(err){
        return next(new HttpError("Sign Up failed ,try again later",500))
    } 

    if(existingBuyer)
    return next(new HttpError("Buyer is already registered with the email id.",406))

    if(existingSeller)
    return next(new HttpError("Seller is already registered with the email id.",406))
    



let hashedPass ;
// creating a hashed password for the user
try{
    hashedPass = await bcrypt.hash(password,12);
}catch(err)
{
    return next(new HttpError("Could not create user,please try again",500));
}

let createdUser;
 if(type==="buyer")
 {
     createdUser = new Buyer({
        name,
        email,
        password:hashedPass,

    })

    //saving buyer

    try{
        await createdUser.save();
    }catch(err){
        return next(new HttpError("SignUp failed ,please try again ",500))
    }

 }else{

     createdUser = new Seller({
        name,
        email,
        password:hashedPass,

    })

    //creating a catalog for seller
    const catalog = new Catalog({
        seller:createdUser._id,
    })
    createdUser.catalog = catalog._id;

    //saving seller along with its catalog
    try{
 
        const sess = await mongoose.startSession();

        sess.startTransaction();
        await createdUser.save({session:sess});
        await catalog.save({session:sess});
        await sess.commitTransaction();
    }catch(err){

        return next(new HttpError("SignUp failed ,please try again ",500))
    }
   

 }
    let token;
    //generating token for the user
    try{
        token =  jwt.sign({userId:createdUser.id,email:createdUser.email},`${process.env.JWT_KEY}`,{expiresIn:'1h'})
    }catch(err)
    {
            return next(new HttpError("Could not sign you in,please try again",500));
    }

    res.status(201).json({userId:createdUser.id,email:createdUser.email,token:token});
}


const login = async (req,res,next)=>{
    let existingBuyer;
    let existingSeller;

    const {email,password} = req.body;

    //finding user in the database
    try{
        existingBuyer = await Buyer.findOne({email:email});
        existingSeller = await Seller.findOne({email:email});
    }catch(err){
        return next(new HttpError("Sign Up failed ,try again later",500))
    }  
    
    //if no user found
    if(!existingBuyer && !existingSeller)
    {
        return next(new HttpError("Invalid credentials",401));
    }
    

    let passIsValid = false;
    let existingUser = existingBuyer ? existingBuyer:existingSeller;

    //verifying the password
try{
    passIsValid = await bcrypt.compare(password,existingUser.password)
}catch(err){
    return next(new HttpError("Could not log you in,please check your credentials and try again",401))
}
   if(!passIsValid)
   {
    return next(new HttpError("Could not log you in,please check your credentials and try again",401))
   }

   //generating token for the logged in user
   let token;
   try{
       token =  jwt.sign({userId:existingUser.id,email:existingUser.email},`${process.env.JWT_KEY}`,{expiresIn:'1h'})
   }catch(err)
   {
           return next(new HttpError("Could not log you in,please try again",500));
   }


    res.status(200).json({userId:existingUser.id,email:existingUser.email,token:token});
}


exports.login = login;
exports.register = register;