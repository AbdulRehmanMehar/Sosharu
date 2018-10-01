module.exports = (req, res, next) => {
  res.locals._csrf = req.csrfToken();
  next();
};