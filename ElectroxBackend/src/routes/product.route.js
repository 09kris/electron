import {addProduct,showAllProducts,showSingleProduct,getProducts} from '../controllers/product.controller.js';
import {verifySeller} from "../middlewares/varifySeller.js";
import {upload} from "../middlewares/multer.middleware.js";

import express from 'express';
const productRouter = express.Router();
// Route to add a new product
productRouter.post('/add', verifySeller, upload.array('images'), addProduct);
productRouter.get('/all', showAllProducts);
// productRouter.get('/seller', verifySeller, showProductsBySeller);
productRouter.get('/:productId', showSingleProduct);
productRouter.get('/getProduct/:ProductIds',getProducts);
export {productRouter};
