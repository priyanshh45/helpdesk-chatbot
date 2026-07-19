const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


// Load environment variables
dotenv.config();

const chatRoutes = require("./routes/chat");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Help Desk Chatbot Backend is Running 🚀");
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});