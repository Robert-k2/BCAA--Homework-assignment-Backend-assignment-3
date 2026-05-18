import mongoose from "mongoose";
 
const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    categoryList: [
      {
        type: String,
        trim: true,
      },
    ],
    inventory: {
      quantity: {
        type: Number,
        default: 0,
        min: 0,
      },
      minimumThreshold: {
        type: Number,
        default: 5,
        min: 0,
      },
    },
    supplier: {
      name: { type: String, trim: true },
      contactEmail: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
  },
  { timestamps: true }
);
 
export default mongoose.model("Product", productSchema);