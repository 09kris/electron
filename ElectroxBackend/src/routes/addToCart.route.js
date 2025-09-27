import express from 'express';
import { addProductToCart } from '../controllers/addToCart.controller.js';
import { verifyUser } from '../middlewares/varifyUser.js';

const addTocart = express.Router();

addTocart.post('/:productId/:quantity', verifyUser, addProductToCart);

export default addTocart;
 