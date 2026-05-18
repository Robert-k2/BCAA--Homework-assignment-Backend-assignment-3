// imports mongoose to define schema and model
import mongoose from "mongoose";

// defines the structure of a product document
const productSchema = new mongoose.Schema(

  {
    // optional custom product identifier
    productId: {
      type: String,
      trim: true, // removes extra spaces
    },

    // product name (required field)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // product price (must be 0 or higher)
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // optional product description
    description: {
      type: String,
      trim: true,
    },

    // optional image url for product
    imageUrl: {
      type: String,
      trim: true,
    },

    // list of categories the product belongs to
    categoryList: [
      {
        type: String,
        trim: true,
      },
    ],

    // embedded inventory object for stock management
    inventory: {

      // current quantity in stock (cannot be negative)
      quantity: {
        type: Number,
        default: 0,
        min: 0,
      },

      // minimum stock threshold before considered low stock
      minimumThreshold: {
        type: Number,
        default: 5,
        min: 0,
      },
    },

    // supplier information object
    supplier: {

      // supplier name
      name: {
        type: String,
        trim: true,
      },

      // supplier contact email
      contactEmail: {
        type: String,
        trim: true,
      },

      // supplier phone number
      phone: {
        type: String,
        trim: true,
      },
    },
  },

  // automatically adds createdAt and updatedAt timestamps
  { timestamps: true }
);

// exports the product model for use in controllers
export default mongoose.model("Product", productSchema);