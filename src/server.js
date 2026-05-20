require("dotenv").config();

const express = require("express");

const cors = require("cors");

const connectDB = require("./config/db");

const documentRoutes = require("./routes/documentRoutes");

const app = express();



// DATABASE CONNECTION

connectDB();



// MIDDLEWARES

app.use(cors());

app.use(express.json());



// ROUTES

app.use("/api", documentRoutes);



// HOME ROUTE

app.get("/", (req, res) => {

    res.send("API Running");
});



// SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on ${PORT}`);
});