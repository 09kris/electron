import {Product} from '../models/product.model.js';
import { Seller } from '../models/seller.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponce.js';
import { uploadToCloudinary } from '../utils/upload.cloudnary.js';
import jwt from 'jsonwebtoken';



const addProduct = asyncHandler(async (req, res) => {
    // console.log("Adding product with data:", req.body);
    
    const {description, price, category, stock,name } = req.body;
    const images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename // Assuming filename is used as public_id
    }));
    
    if (!name || !description || !price || !category || !stock ) {
        throw new apiError(400, "All fields are required");
    }
    const uploadedImages = await Promise.all(
        images.map(async (image) => {
            const uploadedImage = await uploadToCloudinary(image.url);
            return {
                url: uploadedImage,
                public_id: image.public_id
            };
        })
    );
    if (uploadedImages.length === 0) {
        throw new apiError(500, "Failed to upload images");
    }
    //res sellerid from req.cookies
     const token = req.cookies.refreshToken; 
            
            if (!token) {
                throw new apiError(400,"You are not authenticated");
            }
            
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log("Decoded token:", decoded.id);
            
    const seller = await Seller.findById(decoded.id);
    if (!seller) {
        throw new apiError(404, "Seller not found");
    }

    const newProduct = await Product.create({
        name,
        description,
        images: uploadedImages,
        price,
        category,
        stock,
        seller: req.seller._id // Assuming req.user is populated with the authenticated user's info
    });

    res.status(201).json(
        new apiResponse(201, newProduct, "Product added successfully")
    );
})


const showAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    if (!products || products.length === 0) {
        throw new apiError(404, "No products found");
    }
    res.status(200).json(
        new apiResponse(200, products, "Products retrieved successfully")
    );
})

//show product by seller

const showProductsBySeller = asyncHandler(async (req, res) => {
    const sellerId = req.seller._id; // Assuming req.seller is populated with the authenticated seller's info
    const products = await Product.find
        ({ seller: sellerId }).populate('seller', 'storeName ownerName email'); // Populate seller info
    if (!products || products.length === 0) {
        throw new apiError(404, "No products found for this seller");
    }
    res.status(200).json(
        new apiResponse(200, products, "Products retrieved successfully")
    );
}
);

// const buyProduct = asyncHandler(async (req, res) => {
    
// })

//show product by id
const showSingleProduct=asyncHandler(async(req,res)=>{
    const {productId}=req.params;
    console.log("Product ID from params:", productId);
    
    const product = await Product.findById(productId);
    if (!product) {
        throw new apiError(404, "Product not found");
    }
    res.status(200).json(
        new apiResponse(200, product, "Product retrieved successfully")
    );
})


const getProducts=asyncHandler(async(req,res)=>{
    const { ProductIds } = req.params;
// console.log(ProductIds); // 
const ProductIdsarr=ProductIds.split(',');
// console.log(ProductIdsarr);

const productsPrice=await Product.find({_id:ProductIdsarr}).select('price');
// console.log(productsPrice);

// console.log(products);

if (!productsPrice) {
    throw new apiError(400,"product not found");
}

const total = productsPrice.reduce((sum, product) => sum + product.price, 0);

res.status(200).json(
    new apiResponse(200,total,"price fatched")
);
    
})
export {addProduct, showAllProducts, showProductsBySeller, showSingleProduct,getProducts};

