const User = require('../models/userModel')
const products = require("../models/productModel");
const category = require('../models/category');

const loadCart = async (req, res) => {
    try {
        userSession = req.session.user_id;
        if (userSession) {
            const categoryData = await category.find()
            const userData = await User.findById({ _id: userSession })
            const completeUser = await userData.populate('cart.item.productId')

            res.render("cart", { user: req.session.user, cartProducts: completeUser.cart, categoryData: categoryData });
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error.message);
    }
}

const addToCart = async (req, res) => {
    try {
        const productId = req.query.id;
        console.log(productId);
        userSession = req.session.user_id;
        if (userSession) {
            const details = await products.findOne({ _id: productId })
            const product = await products.find({ category: details.category });
            const userData = await User.findById({ _id: userSession })
            const productData = await products.findById({ _id: productId })
            userData.addToCart(productData)
            res.redirect('/loadCart');
            // res.render('details',{ user: req.session.user,message:"product added to cart !",detail: details, related: product })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error)
    }
}

const updateCart = async (req, res) => {
    try {
        ;
        let { quantity, _id, preValue } = req.body;
        console.log(quantity, _id, preValue)
        const userData = await User.findById({ _id: req.session.user_id });
        const productData = await products.findById({ _id: _id })
        const categoryData = await category.find();
        const categoryItem = categoryData.find(cat => cat.name === productData.category);
        const CartIds = userData.cart.item;
        const cartPrId = CartIds.map((item) => item.productId);
        const productDetails = await products.find({ _id: { $in: cartPrId } });
        const proCata = productDetails.map(items => items.category);
        const matchedCategory = categoryData.filter(category => proCata.includes(category.name));
        const TotalDiscount = matchedCategory.reduce((total, items) => total + items.discountPercentage,0);

        // let total = 0;
        // let discountedTotalPrice = 0;
        let discountedPrice = 0;
       let totalPrice;
        console.log("categoryItem" + categoryItem);
        console.log("dis_per" + categoryItem.discountPercentage)
        if (categoryItem.discountPercentage !== 0) {
            discountedPrice = productData.price - (productData.price * categoryItem.discountPercentage) / 100;
          totalPrice = discountedPrice * quantity;
        } else {
            discountedPrice = productData.price;
            totalPrice = discountedPrice * quantity;
        }
        // const totalPrice = discountedPrice * quantity;
        console.log(totalPrice);
        let test = await userData.updateCart(_id, quantity)        
        const Total = test
        console.log("discountedPrice" + discountedPrice)
        res.json({ test, price: totalPrice })

    } catch (error) {
        console.log(error)
    }
}

const deleteCart = async (req, res,) => {

    try {
        const productId = req.query.id
        userSession = req.session
        const userData = await User.findById({ _id: userSession.user_id })
        userData.removefromCart(productId)
        res.redirect('/loadCart')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    loadCart,
    addToCart,
    deleteCart,
    updateCart,
}