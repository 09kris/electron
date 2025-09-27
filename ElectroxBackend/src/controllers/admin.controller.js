import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponce.js";
import { Product } from "../models/product.model.js";
import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {Seller} from "../models/seller.model.js";
import {Category} from "../models/category.model.js";
import { uploadToCloudinary } from "../utils/upload.cloudnary.js";

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new apiError(400, "Email and password are required");
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new apiError(404, "Admin not found");
    }

    // const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (password !== admin.password) {
        throw new apiError(401, "Invalid password");
    }

    const token = jwt.sign({ id: admin._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json(new apiResponse(200, { token }, "Login successful"));
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
        throw new apiError(404, "No users found");
    }
    res.status(200).json(new apiResponse(200, users, "Users retrieved successfully"));
});
const getAllSellers = asyncHandler(async (req, res) => {
    const sellers = await Seller.find().select("-password");
    if (!sellers || sellers.length === 0) {
        throw new apiError(404, "No sellers found");
    }
    res.status(200).json(new apiResponse(200, sellers, "Sellers retrieved successfully"));
});

const allProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    if (!products || products.length === 0) {
        throw new apiError(404, "No products found");
    }
    res.status(200).json(new apiResponse(200, products, "Products retrieved successfully"));
});
//add cteagory
import path from 'path';

const addCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new apiError(400, "Name and description are required");
    }

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      throw new apiError(400, "Category already exists");
    }

    if (!req.file) {
      throw new apiError(400, "Image file is required");
    }

    console.log("File received:", req.file);
    
    // ✅ Fix the file path for Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path);
    console.log("File uploaded to Cloudinary:", uploadResult);

    const category = new Category({
      name: name.trim(),
      description,
      image: uploadResult, // Save Cloudinary URL
    });

    await category.save();

    res.status(201).json(new apiResponse(201, category, "Category created successfully"));
  } catch (error) {
    console.error("Category creation error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});
//varify Seller
const verifySeller = asyncHandler(async (req, res) => {
    const { sellerId } = req.body;

    if (!sellerId) {
        throw new apiError(400, "Seller ID is required");
    }

    const seller = await Seller.findById(sellerId);
    if(!seller) {
        throw new apiError(404, "Seller not found");
    }
    seller.isVerified = true;
    await seller.save();
    res.status(200).json(new apiResponse(200, seller, "Seller verified successfully"));

  })

export { loginAdmin, getAllUsers, getAllSellers, allProducts, addCategory, verifySeller };