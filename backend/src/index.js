require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const celebrationRoutes = require("./routes/celebrationRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", userRoutes);
app.use("/", celebrationRoutes);

const DB_URL = process.env.MONGO_URI;

mongoose.connect(DB_URL) 
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log("Error connecting to database", err));

app.listen(3000, () => {
    console.log("Server listening at port 3000");
})