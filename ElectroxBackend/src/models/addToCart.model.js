import mongoose, { Mongoose } from "mongoose";

const addToCartSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }

},{timeseries:true})
export const addToCart=mongoose.model("addToCart",addToCartSchema)