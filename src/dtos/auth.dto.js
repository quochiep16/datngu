const validateRegisterDto = (body) => {
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const confirmPassword = body.confirmPassword;

  if (!name) {
    return {
      isValid: false,
      message: "Vui lòng nhập họ tên",
    };
  }

  if (!email) {
    return {
      isValid: false,
      message: "Vui lòng nhập email",
    };
  }

  if (!email.includes("@")) {
    return {
      isValid: false,
      message: "Email không hợp lệ",
    };
  }

  if (!password) {
    return {
      isValid: false,
      message: "Vui lòng nhập mật khẩu",
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: "Mật khẩu xác nhận không khớp",
    };
  }

  return {
    isValid: true,
    data: {
      name,
      email,
      password,
    },
  };
};

const validateLoginDto = (body) => {
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email) {
    return {
      isValid: false,
      message: "Vui lòng nhập email",
    };
  }

  if (!password) {
    return {
      isValid: false,
      message: "Vui lòng nhập mật khẩu",
    };
  }

  return {
    isValid: true,
    data: {
      email,
      password,
    },
  };
};

module.exports = {
  validateRegisterDto,
  validateLoginDto,
};