import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";

// ── CREATE PRODUCT ────────────────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const { productId, name, price, description, imageUrl, quantity, categoryList, inventory, supplier } = req.body;

    const product = await Product.create({
      productId,
      name,
      price,
      description,
      imageUrl,
      categoryList: categoryList ?? [],
      inventory: {
        quantity: quantity ?? inventory?.quantity ?? 0,
        minimumThreshold: inventory?.minimumThreshold ?? 5,
      },
      supplier,
    });

    res.status(201).json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET ALL PRODUCTS ──────────────────────────────────────
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── CREATE INVENTORY LOG ──────────────────────────────────
export const createLog = async (req, res) => {
  try {
    const { product, action, amount } = req.body;

    if (!product || !action || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const numericAmount = Number(amount);

    if (numericAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (!["ADD", "REMOVE"].includes(action)) {
      return res.status(400).json({ message: "Invalid action type" });
    }

    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (action === "ADD") {
      foundProduct.inventory.quantity += numericAmount;
    }

    if (action === "REMOVE") {
      if (foundProduct.inventory.quantity < numericAmount) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      foundProduct.inventory.quantity -= numericAmount;
    }

    await foundProduct.save();

    const log = await InventoryLog.create({ product, action, amount: numericAmount });

    res.status(201).json({ success: true, data: log });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
