const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
};

const preventAuthPage = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  next();
};

module.exports = {
  requireAuth,
  preventAuthPage,
};