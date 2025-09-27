import { Router } from "express";
import { registerUser,loginUser,getCartItems ,getCurrentUser} from "../controllers/user.controller.js";
import {verifyUser} from "../middlewares/varifyUser.js";
import { createOrder,getAllOrders } from "../controllers/orders.controller.js";
import multer from "multer";
import { addToCart } from "../models/addToCart.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponce.js";
import { get } from "mongoose";
//null file upload
const upload = multer();


const userRouter = Router();
userRouter.post("/register",upload.none(), registerUser);
userRouter.post("/login", upload.none(), loginUser);
userRouter.post("/order", verifyUser, createOrder);
userRouter.get("/orders", verifyUser, getAllOrders);
userRouter.get("/getCart/:userId", verifyUser, getCartItems);
userRouter.get("/me", verifyUser, getCurrentUser);

export { userRouter };