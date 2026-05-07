const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");

const connectDB = require("./src/config/database");
const authRoute = require("./src/routes/auth.route");
const { requireAuth } = require("./src/middlewares/auth.middleware");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Connect database
connectDB();

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Current user dùng chung cho EJS
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", authRoute);

// Home
app.get("/", (req, res) => {
  res.render("home", {
    appName: process.env.APP_NAME || "PlantCare Reminder",
  });
});

// Dashboard
app.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    user: req.session.user,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});