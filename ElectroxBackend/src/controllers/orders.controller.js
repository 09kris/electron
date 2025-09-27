import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import apiResponse from "../utils/apiResponce.js";
import { uploadToCloudinary } from "../utils/upload.cloudnary.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const createOrder = asyncHandler(async (req, res) => {
    let {products, shippingAddress, paymentMethod} = req.body;
    if(products.length === 0 || !paymentMethod) {
        throw new apiError(400, "All fields are required");
    }
    if(!shippingAddress){
        shippingAddress = await User.findById(req.user._id).select("address");
        if (!shippingAddress) {
            throw new apiError(404, "Shipping address not found");
        }
    }
  const productDetails = await Product.find({_id: {$in: products.map(p => p.productId)}});
  if(!productDetails){
    throw new apiError(404, "Products not found");
  }
 let totalAmount = 0;

products.forEach(p => {
  totalAmount += p.price * p.quantity;
});

    const newOrder = await Order.create({
        products,
        shippingAddress,
        paymentMethod,
        user: req.user._id,
        totalAmount
    });
    res.status(201).json(
        new apiResponse(201, newOrder, "Order created successfully")
    );
})

const getAllOrders=asyncHandler(async(req,res)=>{
    const user=req.cookies.accessToken;
    if (!user) {
        throw new apiError(400, "You are not authenticated");
    }
    const decoded = jwt.verify(user, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.id;
    const orders = await Order.find({ user: userId });
    res.status(200).json(
        new apiResponse(200, orders, "Orders retrieved successfully")
    );
})
export { createOrder, getAllOrders };