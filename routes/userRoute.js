const express = require("express");
const user_route = express();
const session = require("express-session");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");
const wishlistController = require("../controllers/wishlistController");

require('dotenv').config();

user_route.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: true,
    })
  );
user_route.set("views", "./views/users");

user_route.get("/", userController.loadHome);

user_route.get("/login", auth.isLogout, userController.loginLoad);

user_route.get("/register", userController.loadRegister);

user_route.get("/login", auth.isLogout, userController.loginLoad);

user_route.post("/login", userController.verifyLogin);

user_route.get("/register", auth.isLogout, userController.loadRegister);

user_route.post("/register", userController.loadOtp);

user_route.post("/otpPage", userController.verifyOtp);

user_route.use(auth.isLogin);

user_route.get("/home", userController.loadHome);

user_route.get("/login",auth.isLogin,userController.loadHome);

user_route.get("/userProfile",auth.isLogin,userController.loadUserProfile);

user_route.get("/editUser",userController.editUser);

user_route.post("/editUser",userController.editUserUpdate);

user_route.post("/addAddress",userController.addNewAddress);

user_route.get("/deleteAddress",userController.deleteAddress);

user_route.get("/deleteAddressCart",userController.deleteAddressCart);

user_route.get("/editAddress",userController.editAddress);

user_route.post("/editAddress",userController.editUpdateAddress);

user_route.get("/loadShop",userController.loadShop);

user_route.get("/viewDetails",userController.loadDetails);

user_route.get("/wishlist",wishlistController.loadWishlist)

user_route.get("/addWishlist",wishlistController.addWishlist);

user_route.get("/deleteWishlist", wishlistController.removeWishlist);

user_route.get("/addCartremoveWishlist",wishlistController.addToCartRemovefromWishlist);

user_route.get("/loadCart",cartController.loadCart);

user_route.get("/addToCart",cartController.addToCart);

user_route.post("/updateCart",cartController.updateCart);

user_route.get('/deleteCart',cartController.deleteCart);

user_route.get("/loadCheckout",userController.loadCheckout);

user_route.post("/applyCoupon",userController.applyCoupon);

user_route.get("/onlinePayment",userController.loadOrderSuccess);

user_route.post("/orderSuccess",userController.placeOrder);

user_route.get("/editcheckoutAddress",userController.editCheckoutAddress);

user_route.post("/editcheckoutAddress",userController.editUpdateCheckoutAddress);

user_route.get("/cancelOrder",userController.cancelOrder);

user_route.get("/returnOrder",userController.retunOrder);

user_route.get("/vieworder",auth.isLogin,userController.viewOrderDetails);

user_route.get("/logout",userController.userLogout);




module.exports = user_route;
  