const {
  validateRegisterDto,
  validateLoginDto,
} = require("../dtos/auth.dto");

const {
  registerUser,
  loginUser,
} = require("../services/auth.service");

const showRegisterPage = (req, res) => {
  res.render("auth/register", {
    title: "Đăng ký",
    error: null,
    oldData: {},
  });
};

const register = async (req, res) => {
  try {
    const validation = validateRegisterDto(req.body);

    if (!validation.isValid) {
      return res.render("auth/register", {
        title: "Đăng ký",
        error: validation.message,
        oldData: req.body,
      });
    }

    const result = await registerUser(validation.data);

    if (!result.success) {
      return res.render("auth/register", {
        title: "Đăng ký",
        error: result.message,
        oldData: req.body,
      });
    }

    res.redirect("/login");
  } catch (error) {
    console.error("Register error:", error);

    res.render("auth/register", {
      title: "Đăng ký",
      error: "Có lỗi xảy ra khi đăng ký",
      oldData: req.body,
    });
  }
};

const showLoginPage = (req, res) => {
  res.render("auth/login", {
    title: "Đăng nhập",
    error: null,
    oldData: {},
  });
};

const login = async (req, res) => {
  try {
    const validation = validateLoginDto(req.body);

    if (!validation.isValid) {
      return res.render("auth/login", {
        title: "Đăng nhập",
        error: validation.message,
        oldData: req.body,
      });
    }

    const result = await loginUser(validation.data);

    if (!result.success) {
      return res.render("auth/login", {
        title: "Đăng nhập",
        error: result.message,
        oldData: req.body,
      });
    }

    req.session.user = result.user;

    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);

    res.render("auth/login", {
      title: "Đăng nhập",
      error: "Có lỗi xảy ra khi đăng nhập",
      oldData: req.body,
    });
  }
};

const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);
      return res.redirect("/");
    }

    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};

module.exports = {
  showRegisterPage,
  register,
  showLoginPage,
  login,
  logout,
};