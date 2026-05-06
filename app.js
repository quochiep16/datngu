const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./src/config/database");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home", {
    appName: process.env.APP_NAME || "PlantCare Reminder",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});