const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    category: {
      type: String,
      required: true,
    },

    images: [
      {
        public_id: String,
        url: String,
      }
    ],

    // Added support for luxury materials/attributes
    materials: [
      {
        type: String
      }
    ],

    // Added support for variants (e.g., Sizes, Volumes, Colors)
    variants: [
      {
        name: String, // e.g., "Size", "Volume"
        options: [String], // e.g., ["50ml", "100ml"] or ["Size 6", "Size 7"]
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
