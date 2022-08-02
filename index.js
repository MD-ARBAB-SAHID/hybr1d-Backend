const express = require("express");
const app = express();
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");
const  authMiddleware = require("./middlewares/auth.js")
require('dotenv').config()


const userRouter = require("./routes/users-routes")
const sellerRouter = require("./routes/sellers-routes")
const buyerRouter  = require("./routes/buyers-routes");
app.use(express.json())

app.use((req,res,next)=>{
    
    res.setHeader('Access-Control-Allow-Origin',"*");

    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");

    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE")
    
    next();
})



app.use("/api/auth",userRouter)
app.use(authMiddleware);
app.use("/api/seller",sellerRouter);
app.use("/api/buyer",buyerRouter);

app.get("/",(req,res)=>{
    return res.send("Server Started");
})

app.use((req,res,next)=>{
    next(new HttpError("Could not find",404));

})



app.use((error,req,res,next)=>{

  
   
    res.status(error.code || 500).json({message:error.message || "Something went wrong"});
    
})

mongoose.connect(`mongodb+srv://rocket:rp17@cluster0.7cxcdr0.mongodb.net/Hybr1d?retryWrites=true&w=majority`).then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`Running at port ${process.env.PORT || 3000}`)
    })
}).catch((err)=>{
    console.log(err);
})



