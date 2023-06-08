const User = require("../models/userModel");
const products = require("../models/productModel");

const loadWishlist = async (req, res) => {
    try {
        const userSession = req.session

        if (userSession) {
            const  userData = await User.findById({ _id: userSession.user_id });
            const completeUser = await userData.populate('wishlist.item.productId');
            res.render('wishlist', { user: req.session.user, wishlistProducts: completeUser.wishlist })
        }else {
            res.redirect('/login');
        }
    }catch(error) {
        console.log(error.message)
    }
}
const addWishlist = async (req, res) => {
    const productId = req.query.id  
    const userSession = req.session
    console.log("user "+req.session);
    if (userSession.user_id) {
        const userData = await User.findById({ _id: userSession.user_id })
        const productData = await products.findById({ _id: productId })
        userData.addToWishlist(productData)
        res.redirect('/wishlist')
    } else {
        res.redirect('/login')
    }
}
const removeWishlist = async(req,res) => {
    const productId = req.query.id;
    const userSession = req.session;
    const userData = await User.findById({_id : userSession.user_id});
    userData.removefromWishlist(productId);
    const message = 'Wishlist item has been removed.';
    res.redirect('/wishlist?message=' + encodeURIComponent(message));
   
}
const addToCartRemovefromWishlist = async (req,res) => {
    try {
        userSession = req.session.user_id;
        if(userSession) {
            const productId = req.query.id;
            const productData = await products.findById({ _id: productId })
            userSession = req.session
            const userData = await User.findById({ _id: userSession.user_id })
            userData.addToCart(productData);
            userData.removefromWishlist(productId);
            res.redirect('/loadCart')
            
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    loadWishlist,
    addWishlist,
    removeWishlist,
    addToCartRemovefromWishlist,
}