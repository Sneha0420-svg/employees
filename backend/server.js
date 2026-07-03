import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Connect Database
connectDB();

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/login", loginRoutes);
// Added Auth route here

// Home route
app.get("/", (req, res) => {
  res.send("Employee API Running Successfully 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


