const User = require("../models/userModel");
const category = require("../models/category");
const path = require('path');
const Product = require("../models/productModel");
const orders = require("../models/orderModel");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const loadLogin = async (req, res,next) => {
    try {
      res.render("adminLogin", { user: req.session.user });
    } catch (error) {
      next(error)
    }
  };
  
  const verifyLogin = async (req, res,next) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
  
      const userData = await User.findOne({ email: email });
  
      if (userData) {
        const passwordMatch = await bcrypt.compare(password, userData.password);
  
        if (passwordMatch) {
          if (userData.is_admin === false) {
            res.render("adminLogin", { message: "email and password incorrect" });
          } else {
            req.session.admin_id = userData._id;
            res.redirect("/admin/home");
          }
        } else {
          res.render("adminLogin", { message: " password is incorrect", user: req.session.admin_id });
        }
      } else {
        res.render("adminLogin", { message: "email is incorrect", user: req.session.admin_id });
      }
    } catch (error) {
      next(error);
    }
  };
  const loadDashboard = async (req, res, next) => {
    try {
      
      const products = await Product.find();
      let pds = [];
      let qty = [];
  
      products.forEach((product) => {
        if (product.stock <= 30) {
          pds.push(product.name);
          qty.push(product.stock);
        }
      });
  
      const arr = [];
      const order = await orders.find().populate('products.item.productId');
  
      for (let orders of order) {
        for (let product of orders.products.item) {
          if (orders.status === 'Delivered'||orders.status === 'delivered'||orders.status === 'reject return') {
            const index = arr.findIndex((obj) => obj.product == product.productId.name);
            if (index !== -1) {
              arr[index].qty += product.qty;
            } else {
              arr.push({ product: product.productId.name, qty: product.qty });
            }
          }
        }
      }
  
      const key1 = [];
      const key2 = [];
      arr.forEach((obj) => {
        key1.push(obj.product);
        key2.push(obj.qty);
      });
  
      const sales = key2.reduce((value, number) => {
        return value + number;
      }, 0);
  
      let totalRevenue = 0;
  
      for (let orders of order) {
        if (orders.status === 'Delivered'||orders.status === 'delivered'||orders.status === 'reject return') {
          totalRevenue += orders.products.totalPrice;
        }
      }
  
      const userData = await User.findById({ _id: req.session.admin_id });
  
      res.render('home', { admin: userData, key1, key2, pds, qty, sales, totalRevenue });
    } catch (error) {
      next(error);
    }
  };
  const loadUser = async (req, res,next) => {
    try {
      var search = "";
      if (req.query.search) {
        search = req.query.search;
      }
      const userData = await User.find({ name: { $regex: search + ".*" }, is_admin: false });
      res.render("user", { users: userData });
    } catch (error) {
      next(error);
    }
  };

  const BlockUser = async (req, res,next) => {
    try {
      const id = req.query.id;
      const userData = await User.findOne({ _id: id });
      if (userData.is_verified) {
        await User.findByIdAndUpdate({ _id: id }, { $set: { is_verified: 0 } }); console.log("blocked");
      }
      else { await User.findByIdAndUpdate({ _id: id }, { $set: { is_verified: 1 } }); console.log("unblocked"); }
      res.redirect("/admin/user");
    } catch (error) {
      next(error);
    }
  }

  const loadCategory = async (req, res,next) => {
    try {
      var search = "";
      if (req.query.search) {
        search = req.query.search;
      }
      const userData = await category.find({ name: { $regex: search + ".*" } })
      res.render("categories", { category: userData });
    } catch (error) {
      next(error);
    }
  };
  const addCategories = async (req, res,next) => {
    try {
      const userData = await User.findById({ _id: req.session.admin_id });
      res.render("addCategories", { admin: userData, message: "" });
    } catch (error) {
      next(error);
    }
  };
  
  
  const addCategoriesredir = async (req, res,next) => {
    const findCat = await category.findOne({ name: req.body.addCategory });
    if (findCat) {
      res.render("addCategories", { message: "already exists!" });
    } else {
      try {
        const addCategory = new category({ name: req.body.addCategory })
        addCategory.save()
        
        res.redirect("/admin/category");
      } catch (error) {
        next(error);
      }
    }
  
  };
  
  
  const unlistCategory = async (req, res,next) => {
    try {
      const id = req.query.id;
      console.log(id);
      const categoryData = await category.findOne({ _id: id });
      if (categoryData.is_available) {
        await category.findByIdAndUpdate({ _id: id }, { $set: { is_available: 0 } }); console.log("hidden");
      }
      else { await category.findByIdAndUpdate({ _id: id }, { $set: { is_available: 1 } }); console.log("unhidden"); }
      res.redirect("/admin/category");
    } catch (error) {
      next(error);
    }
  };
  
  
  
  const editCategory = async (req, res,next) => {
    try {
      e_id = req.query.id;
      const catagoryDetail = await category.findOne({ _id: e_id })
      console.log(catagoryDetail);
      res.render("editCategories", { category: catagoryDetail, message: "" });
    } catch (error) {
      next(error);
    }
  };
  
  const editUpdateCategory = async (req, res,next) => {
    const find = await category.findOne({ name: req.body.addCategory })
    if (find) {
      const cat = await category.find();
      res.render("editCategories", { message: "already Exists!!", category: cat })
    } else {
  
      try {
        const categotyData = await category.updateOne({ _id: e_id }, { $set: { name: req.body.addCategory } });
        res.redirect("/admin/category");
      } catch (error) {
        next(error);
      }
    }
  };
  const loadOrder = async (req, res ,next) => {
    try {
  
      const allorders = await orders.find({}).populate("userId").sort({ $natural: -1 });
      const userData = await User.findById({ _id: req.session.admin_id });
      res.render("orders", { admin: userData, orders: allorders, orderDetail: allorders });
    } catch (error) {
      next(error);
    }
  };
  
  const sortOrder = async (req, res,next) => {
    let { start, end } = req.body
    console.log(start, end);
    const allOrders = await orders.find({
      createdAt: { $gte: start, $lte: end }
    }).populate("userId");
    res.send({ orderDetail: allOrders });
  }

  
const updateStatus = async (req, res,next) => {
  try {
    const status = req.body.status;
    const orderId = req.body.orderId;
    const orderDetails = await orders.findByIdAndUpdate({ _id: orderId }, { $set: { status: status } })
    if ((status == "cancelled") && orderDetails.payment.method !== "COD") {
      userDetails = await User.findOne({ _id: orderDetails.userId });
      const walletData = userDetails.wallet;
      userData = await User.updateOne({ _id: orderDetails.userId }, { $set: { wallet: walletData + orderDetails.payment.amount } })
    }
    if (status == "cancelled") {
      const productData = await Product.find()
      const orderData = await orders.findById({ _id: orderId });
      for (let key of orderData.products.item) {
        for (let prod of productData) {
          console.log(key.productId);
          if (new String(prod._id).trim() == new String(key.productId).trim()) {
            prod.stock = prod.stock + key.qty
            await prod.save()
          }
        }
      }
    }
    res.redirect("/admin/order")
  } catch (error) {
    next(error);
  }
}

const viewOrderDetails = async (req, res,next) => {
  try {
    
    const id = req.query.id;
    const order = await orders.findById({ _id: id });
    console.log(order);
    const details = await order.populate('products.item.productId')
    res.render("viewOrderDetails", { orders: details  });
  } catch (error) {
    next(error);
  }
}
const addUser = async (req, res,next) => {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const mno = req.body.mno;
      const password = req.body.password;
      const spassword = await securePassword(password);
  
      const user = new User({
        name: name,
        email: email,
        mobile: mno,
        password: spassword,
        is_admin: false,
      });
  
      const userData = await user.save();
      if (userData) {
        res.redirect("/admin/dashboard");
      } else {
        res.render("new-user", { message: "Something Wrong" });
      }
    } catch (error) {
      next(error);
    }
  };

  const addCategoryOffer = async (req, res,next) => {
    try {
      const userData = await User.findById({ _id: req.session.admin_id });
      const categories = await category.find();
      res.render("addCategoryOffer", { admin: userData, categories:categories, message: "" });
    } catch (error) {
      next(error);
    }
  };

  const addCategoryOfferdir = async (req, res, next)=>{
    try {
      const { categoryId,name, discountPercentage, startDate, endDate, isAvailable} = req.body;
      const cat =await category.findByIdAndUpdate(categoryId, {
        name,
        discountPercentage,
        startDate,
        endDate,
        isAvailable,
      });
      cat.save();
      res.redirect("/admin/category")
    } catch(error) {
        next(error);
    }
  };
  // const loadCategoryOffer = async(req, res, next) =>{
  //   try {
  //     const categories = await category.findById(req.body)
  //     res.render("categoryOffer",{categories:})
  //   }catch(error) {
  //     console.log(error)
  //   }
  // }

  const logout = async (req, res,next) => {
    try {
      req.session.admin_id = null;
      req.session.admin = null
      res.redirect("/admin");
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {   
    loadLogin,
    verifyLogin,
    loadDashboard,
    loadUser,
    BlockUser,
    loadCategory,
    addCategories,
    addCategoriesredir,
    addCategoryOffer,
    addCategoryOfferdir,
    unlistCategory,
    editCategory,
    editUpdateCategory,
    logout,
    loadOrder,
    sortOrder,
    updateStatus,
    viewOrderDetails,    
  }