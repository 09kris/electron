import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      url: { type: String, required: true },
    }
  ],
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPrice: {
    type: Number, // Optional discounted price
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{timeseries:true});

export const Product = mongoose.model('Product', productSchema);
