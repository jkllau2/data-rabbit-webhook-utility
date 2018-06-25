const BearerAuthentication = {
  ensureHasApiAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  },
};

module.exports = BearerAuthentication;