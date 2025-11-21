const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/voters", require("./routes/voteRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/elections", require("./routes/electionRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/votes", require("./routes/voteRoutes_complete"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/polling-stations", require("./routes/pollingStationRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/education", require("./routes/educationRoutes"));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Voting Management System API",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

module.exports = app;
