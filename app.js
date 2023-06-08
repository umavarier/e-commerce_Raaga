const express =require("express");
const nocache=require("nocache");
const userRoute=require('./routes/userRoute');
const mongo = require('./config/config');
const path = require('path')
const adminRoute=require('./routes/adminRoute');
const userForgetPassword=require('./routes/forgotPassword');
const app=express();

require('dotenv').config();

app.set(mongo.mongooseUp())

app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(nocache());

app.use("/",userRoute);
app.use("/admin",adminRoute);
app.use("/forgot",userForgetPassword);
app.all('*', (req, res) => {
  res.render('error');
});

app.listen(process.env.PORT, ()=>{
    console.log(`server is running at ${process.env.PORT}`);
});