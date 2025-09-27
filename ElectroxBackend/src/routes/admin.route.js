import {loginAdmin, getAllUsers, getAllSellers, allProducts, addCategory} from "../controllers/admin.controller.js";
import express from "express";
import {isAdmin} from "../middlewares/varify.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = express.Router();


router.post("/login", loginAdmin);
router.get("/users", isAdmin, getAllUsers);
router.get("/sellers", isAdmin, getAllSellers);
router.get("/products", isAdmin, allProducts);
router.post("/addCategory", isAdmin, upload.single("image"), addCategory);

export default router;
export { router as adminRouter };