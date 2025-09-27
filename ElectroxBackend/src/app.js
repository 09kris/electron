import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.route.js';
import { sellerRouter } from './routes/seller.route.js';
import { productRouter } from './routes/product.route.js';
import { adminRouter } from './routes/admin.route.js';
import addTocart from './routes/addToCart.route.js';
import cookieParser from 'cookie-parser';
// import { productRouter } from './routes/product.route.js';
const app =express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/product",productRouter)
app.use("/user",userRouter)

app.use("/seller",sellerRouter)
app.use("/admin", adminRouter);
app.use("/addToCart", addTocart);
export default app