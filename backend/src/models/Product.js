import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      enum: ["clothing", "watch", "accessory"],
      required: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [String],
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
