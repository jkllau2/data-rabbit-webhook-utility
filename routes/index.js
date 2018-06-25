const passport = require('passport');

const BearerTokenAuthentication = require('../passport/BearerTokenAuthentication');

exports.api = function getAPI(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('*', passport.authenticate('bearer', { session: false }));
  app.use(BearerTokenAuthentication.ensureHasApiAuthenticated);
}