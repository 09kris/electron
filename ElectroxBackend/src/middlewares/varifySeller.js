import jwt from 'jsonwebtoken';
import {Seller} from '../models/seller.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import dotenv from 'dotenv';
dotenv

 const verifySeller = asyncHandler(async (req, res, next) => {
        try {
            const token = req.cookies?.accessToken 
            console.log("Token:", req.cookies);
            
            if (!token) {
                throw new apiError(400,"You are not authenticated");
            }
            
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const seller = await Seller.findById(decoded.id);
            if (!seller) {
                throw new apiError(404, "Seller not found");
            }
            req.seller = seller;
            next();
        } catch (error) {
            throw new apiError(500, error.message || "Internal Server Error");
            
        }

})


export { verifySeller }