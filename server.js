require('dotenv').load();

const express = require('express'),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;
	httpPort = process.env.PORT || 80,
	routes = require('./app/routes.js'),
	app = express(),
	FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID,
	FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET,
	SITE_URL = process.env.SITE_URL;


// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Allow access to /public
app.use('/public', express.static(process.cwd() + '/public'));



// Passport bits... May move these to a seperate file to keep it clean.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: SITE_URL +'/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));







// Set routes and start server.	
routes(app, passport);	
app.listen(httpPort);
console.log('HTTP listening on port ' + httpPort);