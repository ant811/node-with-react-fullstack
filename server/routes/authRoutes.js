const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'));

  app.get('/api/logout', (req, res) => {
    req.logout();
    //req.user should now be null
    res.send(`You are logged out. req.user: ${req.user}`);
  });

  app.get('/api/current_user', (req, res) => {
    //testing, for optional lecture on middleware
    //res.send(req.session);
    res.send(`req.user: ${req.user}`);
  });
};
