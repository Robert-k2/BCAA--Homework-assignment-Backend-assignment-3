const mongoose = require("mongoose");

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    action: {
      type: String,
      enum: ["ADD", "REMOVE"],
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryLog", inventoryLogSchema);