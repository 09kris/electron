import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponce.js";
import { addToCart } from "../models/addToCart.model.js";
import { Product } from "../models/product.model.js";

//..env
import dotenv from "dotenv";
dotenv.config();

const generateAccessTokenAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new apiError(404, "User not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("generateAccessTokenAndRefereshTokens error:", error);
    throw new apiError(500, "Something went wrong");
  }
};
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new apiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new apiError(404, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new apiError(400, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefereshTokens(user._id);

    // Fixed cookie options - remove domain for localhost
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
       
    };

    // Only set domain in production
    // if (process.env.NODE_ENV === "production") {
    //     options.domain = "yourdomain.com";
    // }

    user.password = undefined;

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse(200, { 
            user, 
            accessToken, 
            refreshToken 
        }, "User logged in successfully"));
});
// Register a new user
const registerUser = asyncHandler(async (req,res)=>{
    console.log("Registering user with data:", req.body);
    
    const {  email, password, phone, address ,name} = req.body;
    if (!name || !email || !password || !phone || !address) {
        throw new apiError(400,"all field are required");
    }
    const checkExistUser=await User.find({email:email})
    if(checkExistUser.length){
        throw new apiError(400,"user already exists with this email");
    }
    const user = await User.create({
        name,email,password,phone,address
    }) // Exclude password and refreshToken from the response
    if (!user) {
        throw new apiError(500,"user not created");
    }
    // Check if user already exists
return res.status(200).json(
new apiResponse(200,user,"User registered successfully"))
})


//show all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const {refreshToken} = req.cookies;
    if (!refreshToken) {
        throw new apiError(401, "You are not logged in, please login to get all orders");
    }
    const user = await User.findOne({ refreshToken: refreshToken }).select("_id")
    if (!user) {
        throw new apiError(401, "You are not logged in, please login to get all orders");
    }
    const orders = await Order.find({ userId: user._id }).populate('products.productId', 'name price image').sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
        return res.status(200).json(new apiResponse(200, [], "No orders found for this user"));
    }

    return res.status(200).json(new apiResponse(200, orders, "Orders retrieved successfully"));
});



const getCurrentUser = asyncHandler (async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ refreshToken: refreshToken }).select("-password");
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json(new apiResponse(200, user, "Current user retrieved successfully"));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

const getCartItems = asyncHandler(async (req, res) => {

    const { userId } = req.params;
    console.log("Fetching cart items for userId:", userId);
    

  const cartItems = await addToCart.find({ userId: userId }).populate("productId", "name price images");

  if (!cartItems || cartItems.length === 0) {
    return res.status(404).json(new apiResponse(404, [], "No items found in the cart"));
  }

  console.log("Cart items retrieved:", cartItems);

  res.status(200).json(new apiResponse(200, cartItems, "Cart items retrieved successfully"));
});

export { registerUser,loginUser,getAllOrders,getCartItems,getCurrentUser };