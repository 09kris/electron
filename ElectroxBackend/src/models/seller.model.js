import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import apiError from '../utils/apiError.js';
import bcrypt from 'bcryptjs';

const sellerSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  Logo: {
    type: String,
    required: true,
  }
  , gstNo: {
    type: String,
    required: true,
    unique: true,

  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rerefreshToken:{
    type: String
  }

}, { timestamps: true });


sellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

sellerSchema.methods.comparePassword=async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new apiError('Error comparing passwords');
    
  }
}

// Method to generate a refresh token
sellerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Refresh token valid for 7 days
 
  )
};

// Method to generate an access token
sellerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id},
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // Access token valid for 15 minutes
  )
}



export const Seller = mongoose.model("Seller", sellerSchema)

