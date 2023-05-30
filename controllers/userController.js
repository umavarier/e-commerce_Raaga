const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const Category = require("../models/category");
const sms=require('../middleware/smsValidation');
const products = require("../models/productModel");
const address = require("../models/addressModel");
const order = require("../models/orderModel")


const loadHome = async (req, res,next) => {
    try {
        const product = await products.find({ isAvailable: 1 });
        res.render('home', { user: req.session.user })
        
    }
    catch (error) {
       next(error);
       
    }
}
const loginLoad = async (req, res,next) => {
    try {

        res.render('login', { user: req.session.user })

    }
    catch (error) {
        next(error);

    }
}


const loadRegister = async (req, res,next) => {
    try {

        res.render('register', { user: req.session.user })

    }
    catch (error) {
        next(error);

    }
}


let user;
const loadOtp = async (req, res,next) => {
    const verify = await User.findOne({ $or: [{ mobile: req.body.mno }, { email: req.body.email }] });
    if (verify) {
       
        res.render('register', { user: req.session.user, message: "user already exists!" })
    } else {
        const spassword = await bcrypt.hash(req.body.password, 10);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: spassword,
            is_admin: 0,
        });
        newOtp = 1234;
        // newOtp = sms.sendMessage(req.body.mno);
        console.log(newOtp);
        res.render("otpPage", { otp: newOtp, mobno: req.body.mno })
    }
}


const verifyOtp = async (req, res,next) => {

    try {

        if (req.body.sendotp == req.body.otp) {
            const userData = await user.save();
            if (userData) {
                res.render('register', { user: req.session.user, message: "registered successfully" })
            }
            else {
                res.render('register', { user: req.session.user, message: "registration failed!!" })
            }
        } else {

            console.log("otp not match");
            res.render('register', { user: req.session.user, message: "incorrect otp" })
        }

    } catch (error) {
        next(error);

    }
}

const verifyLogin = async (req, res,next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email, is_admin: 0 });
       
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)

            if (passwordMatch) {
                if (userData.is_verified) {
                    const product = await products.find();
                    req.session.user_id = userData._id;
                    req.session.user = userData.name;
                    req.session.user1 = true;
                    
                    res.redirect("home",302,{ user: userData.name, product: product});
                } else {
                    res.render('login', { message: 'USER BLOCKED BY ADMIN', user: req.session.user })

                }
            }

            else {
                res.render('login', { message: 'email and password are incorrect', user: req.session.user })
            }
        }
        else {
            res.render('login', { message: 'email and password are incorrect', user: req.session.user })
        }



    }
    catch (error) {
        next(error);

    }
}

const loadUserProfile = async (req, res,next) => {
    try {
        const usid = req.session.user_id;
        const user1 = await User.findOne({ _id: usid });
      
        const adid = await address.find({ userId: usid });
        const addressData = await address.find({ userId: usid });
        const details = await User.findOne({ _id: usid });
        const orderData = await order.find({ userId: usid }).sort({ createdAt: -1 }).populate("products.item.productId");
        console.log(details);
        console.log("user1"+user1)
        
        res.render("profile", { user: req.session.user, userAddress: adid, userData: user1, address: addressData , order: orderData, details: details})
    } catch (error) {
        next(error);

    }
}

const editUser = async (req, res,next) => {
    try {
        const currentUser = req.session.user_id;
        const findUser = await User.findOne({ _id: currentUser });
        res.render("editUser", { user: findUser });

    } catch (error) {
        next(error);

    }
}

const editUserUpdate = async (req, res,next) => {
    try {
        await User.findByIdAndUpdate({ _id: req.body.id }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.number

            }
        })
        res.redirect("/userProfile")
    } catch (error) {
        next(error);

    }
}

const addNewAddress = async (req, res,next) => {
    try {
        userSession = req.session
        const nAddress = await new address({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            country: req.body.country,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            mobile: req.body.mno,
            userId: userSession.user_id
        })
        const newAddress = await nAddress.save();
        if (newAddress) {
            res.redirect("/userProfile");
        }
    } catch (error) {
        next(error);

    }
}

const deleteAddress = async (req, res,next) => {
    try {
        const id = req.query.id;
        const Address = await address.deleteOne({ _id: id });
        if (Address) {
            res.redirect("/userProfile");
        }
    } catch (error) {
        next(error);

    }
}
const deleteAddressCart = async (req, res,next) => {
    try {
        const id = req.query.id;
        const Address = await address.deleteOne({ _id: id });
        if (Address) {
            res.redirect("/loadCheckout");
        }
    } catch (error) {
        next(error);

    }
}

const editAddress = async (req, res,next) => {
    try {
        const id = req.query.id;
        const addres = await address.findOne({ _id: id })
        res.render("editaddress", { user: req.session.user, address: addres });
    } catch (error) {
        next(error);

    }
}
const editUpdateAddress = async (req, res,next) => {
    try {
        const id = req.body.id;
        
        const upadteAddres = await address.updateOne({ _id: id }, {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                country: req.body.country,
                address: req.body.address,
                city: req.body.city,
                zip: req.body.zip,
                mobile: req.body.mno
            }
        })
        res.redirect("/userProfile")
    } catch (error) {
        next(error);

    }
}
const loadShop = async (req, res,next) => {
    try {
        const categoryData = await Category.find()
        let { search, sort, category, limit, page, ajax } = req.query
        if (!search) {
            search = ''
        }
        skip = 0
        if (!limit) {
            limit = 15
        }
        if (!page) {
            page = 0
        }
        skip = page * limit
        
        let arr = []
        if (category) {
            for (i = 0; i < category.length; i++) {
               
                    arr = [...arr, categoryData[category[i]].name]
    
            }
        } else {
            
            category = []
            arr = categoryData.map((x) => {
                if(x.is_available===1){
                    return x.name
                }
            })
            
        }
        
        if (sort == 0) {
            productData = await products.find({ $and: [{ category: arr }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] },{isAvailable:1}] }).sort({ $natural: -1 })
            pageCount = Math.floor(productData.length / limit)
            if (productData.length % limit > 0) {
                
                pageCount += 1
            }
            
            productData = await products.find({ $and: [{ category: arr }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] },{isAvailable:1}] }).sort({ $natural: -1 }).skip(skip).limit(limit)
        } else {
            productData = await products.find({ $and: [{ category: arr }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ price: sort })
            pageCount = Math.floor(productData.length / limit)
            if (productData.length % limit > 0) {
                pageCount += 1
            }
            
            productData = await products.find({ $and: [{ category: arr }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ price: sort }).skip(skip).limit(limit)
        }
        
        if (req.session.user) { session = req.session.user } else session = false
        if (pageCount == 0) { pageCount = 1 }
        if (ajax) {
            res.json({ products: productData, pageCount, page })
        } else {
            res.render('shop', { user: session, product: productData, category: categoryData, val: search, selected: category, order: sort, limit: limit, pageCount, page })
        }
    } 
    catch (error) {
        next(error);

    }
}

const loadDetails = async (req, res,next) => {

    try {
        const id = req.query.id;
        const details = await products.findOne({ _id: id })
        const product = await products.find({ category: details.category });
        res.render("details", { user: req.session.user, detail: details, related: product, message: "" });
    } catch (error) {
        next(error);

    }
};
const loadCheckout = async (req, res) => {
    try {
       
        const userData = req.session.user_id;
        const addresss = await address.find({ userId: userData });
        const userDetails = await User.findById({ _id: userSession })
        const completeUser = await userDetails.populate('cart.item.productId')
        res.render("checkout", { user: req.session.user, address: addresss, checkoutdetails: completeUser.cart });
    } catch (error) {
        console.log(error.message);
    }
}
let Norder;
const placeOrder = async (req, res,next) => {
    
    try {
        
        let nAddress;
        if (req.body.address == 0) {
            userSession = req.session
                nAddress = await new address({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                country: req.body.country,
                address: req.body.details,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                mobile: req.body.mno,
                userId: userSession.user_id
            })
            const newAddress = await nAddress.save();
            
        }
        else {
            nAddress = await address.findOne({ _id: req.body.address });
        }


        const userData = await User.findOne({ _id: req.session.user_id })
        
        Norder = new order({
            userId: req.session.user_id,
            address: nAddress,
            payment: {
                method: 'COD',
                amount: req.body.amount,

            },
            products: userData.cart,
        });

        if (req.body.payment == "COD") {
            await Norder.save();
            const productData = await products.find()
            for (let key of userData.cart.item) {
                for (let prod of productData) {

                    if (new String(prod._id).trim() == new String(key.productId._id).trim()) {
                        prod.stock = prod.stock - key.qty
                        await prod.save()
                    }
                }
            }
            await User.updateOne({ _id: req.session.user_id }, { $unset: { cart: 1 } })
            res.render("orderSuccess", { user: req.session.user})
        }
     

    } catch (error) {
        next(error);

    }
}
const cancelOrder = async (req, res,next) => {
    try {
        const id = req.query.id;
        const orderDetails = await order.findById({ _id: id });
        let state = "cancelled"
        await order.findByIdAndUpdate({ _id: id }, { $set: { status: "cancelled" } })
        if (state == "cancelled") {
            const productData = await products.find()
            const orderData = await order.findById({ _id: id });

            for (let key of orderData.products.item) {
                for (let prod of productData) {
                    
                    if (new String(prod._id).trim() == new String(key.productId).trim()) {
                        prod.stock = prod.stock + key.qty
                        await prod.save()
                    }
                }
            }
        }
        res.redirect("/userProfile")
    } catch (error) {
        next(error);

    }
}

const viewOrderDetails = async (req, res,next) => {
    try {
        
        const id = req.query.id;
        const users = req.session.user_id
        const orderDetails = await order.findById({ _id: id });
        const addres = await address.findById({ _id: users })
        await orderDetails.populate('products.item.productId')
        res.render("viewOrderDetails", { user: req.session.user, orders: orderDetails });
    } catch (error) {
        next(error);

    }
}
const editCheckoutAddress = async (req, res,next) => {
    try {
        const id = req.query.id;
        const addressData = await address.findById({ _id: id });
        res.render("editCheckoutAddress", { user: req.session.user, address: addressData });
    } catch (error) {
        next(error);

    }
}


const editUpdateCheckoutAddress = async (req, res,next) => {
    try {
        const id = req.body.id;
        
        const upadteAddres = await address.findByIdAndUpdate({ _id: id }, {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                country: req.body.country,
                address: req.body.address,
                city: req.body.city,
                zip: req.body.zip,
                mobile: req.body.mno
            }
        })
        res.redirect("/loadCheckout")
    } catch (error) {
        next(error);

    }
}


const userLogout = async (req, res,next) => {
    try {
        req.session.user1 = null;
        req.session.user = 0
        req.session.user_id = 0;
        res.redirect('/')
    }
    catch (error) {
        next(error);

    }

}


module.exports = {
    loadHome,
    loginLoad,
    loadRegister,
    loadOtp,
    verifyOtp,
    verifyLogin,
    userLogout,
    loadUserProfile,
    editUser,
    editUserUpdate,
    addNewAddress,
    editAddress,
    editUpdateAddress,
    deleteAddress,
    deleteAddressCart,
    loadShop,
    loadDetails,
    loadCheckout,
    placeOrder,
    viewOrderDetails,
    cancelOrder,
    editUpdateCheckoutAddress,
    editCheckoutAddress,
}