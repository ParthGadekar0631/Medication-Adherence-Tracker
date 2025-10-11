import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import logRoutes from "./routes/logRoutes.js";

const app = express();

// ✅ Middleware should come BEFORE routes
app.use(cors());
app.use(express.json());  // <--- This line is crucial for parsing JSON

// Base routes
app.use("/api/users", userRoutes);
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
  res.send("Medication Adherence Tracker Backend is running 🚀");
});

export default app;