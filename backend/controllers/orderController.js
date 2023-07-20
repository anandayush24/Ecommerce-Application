const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//create new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//get single order
exports.getSingleOrder = catchAsyncErrors (async (req, res, next)=>{
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if(!order){
        return next(new ErrorHander("Order not found with this ID", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

//get logged in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find({user: req.user._id});

  res.status(200).json({
    success: true,
    order,
  });
});

//get all orders --Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find();

  let totalAmount= 0;
  order.forEach((order) => {
    totalAmount+= order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    order,
  });
});
 

//update order status --admin
exports.updateOrder = catchAsyncErrors(async(req, res, next)=>{
    const order= await Order.find(req.params._id);
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHander("Hurrah! You have the order", 400));
    }

    order.orderItems.forEach(async (order)=>{
        await updateStock(order.Product, order.quantity);
    });

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliverAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
});

//update stock
async function updateStock (id, quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

//delete order --Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find(req.params.id);
  if(!order){
    return next(new ErrorHander("Order not found with this ID", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});