import asyncHandler from "../utils/asyncHandler.js";
import {Seller} from "../models/seller.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponce.js";
import {uploadToCloudinary} from "../utils/upload.cloudnary.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";


const generateAccessTokenAndRefereshTokens = async (sellerId) => {
  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      throw new apiError(404, "User not found");
    }

    const accessToken = await seller.generateAccessToken();
    const refreshToken = await seller.generateRefreshToken();

    seller.refreshToken = refreshToken;
    await seller.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("generateAccessTokenAndRefereshTokens error:", error);
    throw new apiError(500, "Something went wrong");
  }
};
//register new seller
const registerSeller = asyncHandler(async (req, res) => {
    const { storeName, ownerName, email, password, phone, address ,gstNo} = req.body;
    console.log("Logo file:", req.body);
    const logo = req.file; // Assuming logo is uploaded as a file
    if (!storeName || !ownerName || !email || !password || !phone || !address || !gstNo) {
        throw new apiError(400, "All fields are required");
    }
    console.log("Logo file:", logo);
    
    const uploadedLogo = await uploadToCloudinary(logo.path); // Upload logo to Cloudinary

    
    if (!uploadedLogo) {
        throw new apiError(500, "Failed to upload logo");
    }
    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email: email, gstNo:gstNo });
    if (existingSeller) {
        throw new apiError(400, "Seller already exists with this email");
    }
    

    const newSeller = await Seller.create({
        storeName,
        ownerName,
        email,
        password,
        phone,
        address,
        Logo:uploadedLogo, 
        gstNo,
        isVerified: false // Default to false, can be updated later
    }); // Exclude password and refreshToken from the response
    
    if (!newSeller) {
        throw new apiError(500, "Seller not created");
    }
    const seller= await Seller.findById(newSeller._id); // Exclude password and refreshToken from the response
    
    return res.status(201).json(new apiResponse(201, seller, "Seller registered successfully"));
});


const loginSeller =asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        throw new apiError(400,"email and password are required");
    }
    const seller =await Seller.findOne({email:email});
    if(!seller){
        throw new apiError(404,"seller not found with this email");
    }
    const varifiedUser=await seller.comparePassword(password)
    if(!varifiedUser){
        throw new apiError(400,"password is incorrect");
    }
    
    const { accessToken, refreshToken } = await generateAccessTokenAndRefereshTokens(seller._id);
      const options = {
    httpOnly: true,
    secure: true
  }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new apiResponse(200, {seller,accessToken,refreshToken}, "seller logged in successfully"));

})

const showAllOrders = asyncHandler(async (req, res) => {
  const { sellerId } = req.body;

  if (!sellerId) {
    throw new apiError(400, "Seller ID is required");
  }
  const allProducts = await Product.find({ seller: sellerId });
  if (!allProducts || allProducts.length === 0) {
    throw new apiError(404, "No products found for this seller");
  }
  const orders=await Order.find({ "products.product": { $in: allProducts.map(p => p._id) } })

  if (!orders || orders.length === 0) {
    return res.status(200).json(new apiResponse(200, [], "No orders found for this seller"));
  }

  console.log("Orders found:", orders);

  res.status(200).json(new apiResponse(200, { orders }, "Orders retrieved successfully"));
});

const showAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories || categories.length === 0) {
    throw new apiError(404, "No categories found");
  }
  res.status(200).json(new apiResponse(200, categories, "Categories retrieved successfully"));
});
export { registerSeller, loginSeller, showAllOrders as showOrders, showAllCategories };