import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import apiError from '../utils/apiError.js';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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
addresses: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAddress'
  }
]
,

  isAdmin: {
    type: Boolean,
    default: false,
  },
   refreshToken: {
            type: String
        }
},{timestamps:true});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword=async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new apiError('Error comparing passwords');
    
  }
}

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Refresh token valid for 7 days
 
  )
};

// Method to generate an access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // Access token valid for 15 minutes
  )
}


export const User = mongoose.model("User", userSchema)
