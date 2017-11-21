
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

	app.route('/')
		.get(function (httpReq, httpRes) {
			httpRes.render('home');
		});
		
		
	
	app.get('/auth/facebook',
	  passport.authenticate('facebook'));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login' }),
	  function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	  });

	app.get('/test',
	  require('connect-ensure-login').ensureLoggedIn(),
	  function(req, res){
		res.render('debug-page');
	  });		
		
};
