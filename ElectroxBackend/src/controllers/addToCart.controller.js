import { addToCart } from "../models/addToCart.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponce.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";

const addProductToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.params;
    console.log(req.params);
    
    const { refreshToken } = req.cookies;
    console.log("Refresh Token:", refreshToken);
    
    if (!productId || !quantity) {
        throw new apiError(400, "Product ID and quantity are required");
    }
    const userId = await User.findOne({ refreshToken: refreshToken }).select("_id");
    if (!userId) {
        throw new apiError(404, "User not found");
    }
    const product = await Product.findById(productId);
    if (!product) {
        throw new apiError(404, "Product not found");
    }
    console.log(product);
    
    const existingCartItem = await addToCart.findOne({ userId: userId._id, productId: productId });
    if (existingCartItem) {
        throw new apiError(200,"product already axist in cart")
    } else {
        const newCartItem = await addToCart.create({ userId: userId._id, productId, quantity });
        if (!newCartItem) {
            throw new apiError(500, "Failed to add product to cart");
        }
        res.status(201).json(new apiResponse(201, newCartItem, "Product added to cart successfully"));
    }

})

export { addProductToCart };