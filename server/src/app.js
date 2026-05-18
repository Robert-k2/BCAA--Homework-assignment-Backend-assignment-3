import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import inventoryLogRoutes from "./routes/inventoryLogRoutes.js";
 
const app = express();
 
app.use(cors());
app.use(express.json());
 
app.use("/api/products", productRoutes);
app.use("/api/logs", inventoryLogRoutes);
 
export default app;
 





