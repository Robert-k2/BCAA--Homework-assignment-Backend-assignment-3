const express = require("express");

const productRoutes = require("./routes/productRoutes");
const inventoryLogRoutes = require("./routes/inventoryLogRoutes");

const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/logs", inventoryLogRoutes);

module.exports = app;

