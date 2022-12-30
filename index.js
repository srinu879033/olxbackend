const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT || 3001;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database Started");
  }
});
app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.get("/", async (req, res) => {
  res.send("Welcome To Olx Server");
});
app.listen(PORT, () => {
  console.log("Welcome to OLX server");
});

module.exports = app;
