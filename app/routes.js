
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
		
	app.route('/login')
		.get(function (httpReq, httpRes) {
			httpRes.render('login');
		});
		
	
	app.get('/auth/facebook',
	  passport.authenticate('facebook'));
	
	
	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login' }),
	  function(req, res) {
		// Successful authentication redirect.
		res.redirect('/test');
	  });

	app.get('/test',
	  require('connect-ensure-login').ensureLoggedIn(),
	  function(req, res){
		res.render('debug-page');
	  });		
		
};
