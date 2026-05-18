import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    action: {
      type: String,
      enum: ["ADD", "REMOVE"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("InventoryLog", inventoryLogSchema);