const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");

const app = express();

// CORS — allow local dev and your Vercel frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lost-found-wx1i.onrender.com", // your render URL
      // "https://your-app.vercel.app"  ← add this after Vercel deploy
    ],
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api/items", itemRoutes);

// Connect to MongoDB & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`),
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
