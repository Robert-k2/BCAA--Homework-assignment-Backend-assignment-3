import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

export default function Analytics() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  const totalStock = products.reduce(
    (sum, p) => sum + (p.inventory?.quantity || 0),
    0
  );

  const lowStock = products.filter(
    (p) => (p.inventory?.quantity || 0) <= 5
  ).length;

  const pieData = [
    { name: "In Stock", value: products.length - lowStock },
    { name: "Low Stock", value: lowStock }
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  return (
    <div>
      <h1>Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="analytics-cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div className="card">
          <h3>Total Stock</h3>
          <p>{totalStock}</p>
        </div>

        <div className="card">
          <h3>Low Stock Items</h3>
          <p>{lowStock}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="chart-box">
        <h3>Stock by Product</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={products}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="inventory.quantity" fill="#111827" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="chart-box">
        <h3>Stock Status Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

