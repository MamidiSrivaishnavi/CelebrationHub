require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require("./routes/userRoutes");
const celebrationRoutes = require("./routes/celebrationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use("/", userRoutes);
app.use("/", celebrationRoutes);
app.use("/", adminRoutes);

const DB_URL = process.env.MONGO_URI;

mongoose.connect(DB_URL) 
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log("Error connecting to database", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})
