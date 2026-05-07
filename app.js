const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");

const connectDB = require("./src/config/database");
const authRoute = require("./src/routes/auth.route");
const plantRoute = require("./src/routes/plant.route");

const { requireAuth } = require("./src/middlewares/auth.middleware");
const { getPlantStats } = require("./src/services/plant.service");

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

// Helper format ngày dùng trong EJS
app.locals.formatDate = (date) => {
  if (!date) return "Chưa có";

  return new Date(date).toLocaleDateString("vi-VN");
};

app.locals.formatDateInput = (date) => {
  if (!date) return "";

  return new Date(date).toISOString().slice(0, 10);
};

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", authRoute);
app.use("/plants", plantRoute);

// Home
app.get("/", (req, res) => {
  res.render("home", {
    appName: process.env.APP_NAME || "PlantCare Reminder",
  });
});

// Dashboard
app.get("/dashboard", requireAuth, async (req, res) => {
  const stats = await getPlantStats(req.session.user.id);

  res.render("dashboard", {
    title: "Dashboard",
    user: req.session.user,
    stats,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});