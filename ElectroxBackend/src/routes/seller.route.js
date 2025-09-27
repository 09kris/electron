import { Router } from "express";
import { registerSeller,loginSeller,showOrders ,showAllCategories} from "../controllers/seller.controller.js";
import {upload} from "../middlewares/multer.middleware.js";


const sellerRouter = Router();
sellerRouter.post("/register", upload.single("logo"), registerSeller);
sellerRouter.post("/login", upload.none(), loginSeller);
sellerRouter.get("/orders", showOrders);
sellerRouter.get("/categories", showAllCategories);

export { sellerRouter };
