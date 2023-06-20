const express=require("express");
const admin_route=express();
const multer = require('../middleware/multer');
// const session=require("express-session");
const config=require("../config/config");
const auth=require('../middleware/adminAuth');
const adminController=require('../controllers/adminController');
const productController=require('../controllers/productController');
const couponController=require('../controllers/couponController');
const bannerController = require('../controllers/bannerController');
const errorHandler = require('../middleware/errorHandler');

require('dotenv').config();

// admin_route.use(
//     session({
//         secret: process.env.SESSIONKEY,
//         resave: false,
//         saveUninitialized: true
//     })
// );

admin_route.set('views','./views/admin');

admin_route.use(express.static('public')); //

admin_route.get('/',auth.isLogout,adminController.loadLogin);

admin_route.post("/",adminController.verifyLogin);

admin_route.use(auth.isLogin);

admin_route.get('/home', adminController.loadDashboard);

admin_route.get('/user', adminController.loadUser);

admin_route.get('/blockUser',adminController.BlockUser);

admin_route.get('/category', adminController.loadCategory);

admin_route.get("/addCategories",adminController.addCategories);

admin_route.post("/addCategories",adminController.addCategoriesredir);

admin_route.get('/unlistCategory',adminController.unlistCategory);

admin_route.get('/editCategory',adminController.editCategory);

admin_route.post('/editCategory',adminController.editUpdateCategory);

admin_route.get("/addCategoryOffer",adminController.addCategoryOffer);

admin_route.post("/addCategoryOffer",adminController.addCategoryOfferdir);

// admin_route.get("/categoryOffer",adminController.loadCategoryOffer)

admin_route.get('/product',productController.loadProduct);

admin_route.get('/addProduct', productController.loadAddProducts);

admin_route.post('/deleteImage', productController.deleteImage);

admin_route.post('/addProduct',multer.uploads.array('pImage',5), productController.addAddProducts);

admin_route.get('/editProduct', productController.showEditProduct);

admin_route.post('/editProduct',multer.uploads.array('pImage',5), productController.editProduct);

admin_route.get('/unlistProduct', productController.unlistProduct);

admin_route.get('/order', adminController.loadOrder);

admin_route.post('/updateOrder',adminController.sortOrder);

admin_route.post("/updateStatus",adminController.updateStatus);

admin_route.get("/loadOrderDetails",adminController.viewOrderDetails);

admin_route.get("/loadCoupon",couponController.loadCoupon);

admin_route.get("/addCoupon",couponController.addCoupon);

admin_route.post("/addCoupon",couponController.addNewCoupon);

admin_route.get("/avail-coupon",couponController.availCoupon);

admin_route.get("/edit-coupon",couponController.editCoupon);

admin_route.post("/edit-coupon",couponController.editUpdateCoupon);

admin_route.get("/delete-coupon",couponController.deleteCoupon);

admin_route.get("/banner",bannerController.loadBanner);

admin_route.get("/add-Banners",bannerController.loadAddBanner);

admin_route.post("/add-Banners",multer.uploads.array('bImage',3),bannerController.addBanner);

admin_route.get("/hideBanner",bannerController.hideBanner)

admin_route.get("/editBanner",bannerController.editBanner);

admin_route.post("/editBanner",multer.uploads.array('bImage',3),bannerController.editModifyBanner);




admin_route.get('/logout', adminController.logout);




module.exports = admin_route;   