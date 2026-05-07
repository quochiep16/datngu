const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");

const connectDB = require("./src/config/database");
const authRoute = require("./src/routes/auth.route");
const plantRoute = require("./src/routes/plant.route");

const { requireAuth } = require("./src/middlewares/auth.middleware");
const { showHome } = require("./src/controllers/plant.controller");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

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

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.locals.formatDate = (date) => {
  if (!date) return "Chưa có";
  return new Date(date).toLocaleDateString("vi-VN");
};

app.locals.formatTime = (date) => {
  if (!date) return "Chưa có";

  return new Date(date).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

app.locals.formatDateTime = (date) => {
  if (!date) return "Chưa có";

  return new Date(date).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

app.locals.formatDateInput = (date) => {
  if (!date) return "";

  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

  return d.toISOString().slice(0, 10);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", authRoute);
app.use("/plants", plantRoute);

app.get("/", requireAuth, showHome);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});