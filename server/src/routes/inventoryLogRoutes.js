import express from "express";
import { createLog } from "../controllers/productController.js";
 
const router = express.Router();
 
router.post("/", createLog);  // POST /api/logs
 
export default router;