
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import dotenv from 'dotenv';
dotenv.config();

 const varifyAdmin = asyncHandler(async (req, res, next) => {
        try {
            const token = req.cookies?.accessToken 
            
            if (!token) {
                throw new apiError(400,"You are not authenticated");
            }
            
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const admin = await Admin.findById(decoded.id);
            if (!admin) {
                throw new apiError(404, "Admin not found");
            }
            req.admin = admin;
            next();
        } catch (error) {
            throw new apiError(500, error.message || "Internal Server Error");
            
        }

})


export { varifyAdmin as isAdmin }