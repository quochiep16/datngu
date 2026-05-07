const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const registerUser = async ({ name, email, password }) => {
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return {
      success: false,
      message: "Email này đã được sử dụng",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    success: true,
    user,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      success: false,
      message: "Email hoặc mật khẩu không đúng",
    };
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return {
      success: false,
      message: "Email hoặc mật khẩu không đúng",
    };
  }

  return {
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};