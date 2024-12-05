const router = require('express').Router();
const passport = require('passport');

// Swagger route
router.use(require('./swagger')); // Registers /api-docs without interfering with other routes

// Route for contacts
router.use('/contacts', require('./contacts'));

// Root route: Displays "Logged In" or "Logged Out" based on session
router.get('/', (req, res) => {
  if (req.session && req.session.user) {
    res.send(`Logged In as ${req.session.user.displayName}`);
  } else {
    res.send("Logged Out");
  }
});

// Login route: Redirects to GitHub for authentication
router.get('/login', passport.authenticate('github'));

// GitHub callback: Handles GitHub OAuth response
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    req.session.user = req.user; // Save user info in the session
    res.redirect('/'); // Redirect to the root route
  }
);

// Logout route: Destroys the session and redirects to "/"
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

module.exports = router;
