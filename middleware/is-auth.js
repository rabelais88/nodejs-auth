module.exports = (res, req, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
};