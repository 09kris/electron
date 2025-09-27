import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyUser = asyncHandler(async (req, res, next) => {
    try {
      // ... existing code ...
const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
// ... rest of the code ...
        // console.log("Token:", req.cookies.accessToken);

        if (!token) {
            throw new apiError(401, "You are not authenticated");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log("Decoded Token:", decoded.id);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new apiError(404, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new apiError(401, "Invalid or expired token"));
        }
        next(error);
    }
});

export { verifyUser };
