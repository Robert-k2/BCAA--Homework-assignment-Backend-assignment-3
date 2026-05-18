import express from "express";
import { createProduct, getAllProducts } from "../controllers/productController.js";
 
const router = express.Router();
 
router.post("/", createProduct);   // POST /api/products
router.get("/", getAllProducts);   // GET  /api/products
 
export default router;

