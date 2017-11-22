
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
			httpRes.render('home', { user: req.user } );
		});
		
	app.route('/login')
		.get(function (httpReq, httpRes) {
			httpRes.render('login');
		});
		
	
	app.get('/auth/facebook',
	  passport.authenticate('facebook'));
	
	app.get('/logout', function(httpReq, httpRes){
	  httpReq.logout();
	  httpRes.redirect('/');
	});
	
	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login' }),
	  function(httpReq, httpRes) {
		// Successful authentication redirect.
		httpRes.redirect('/test');
	  });

	app.get('/test',
	  require('connect-ensure-login').ensureLoggedIn(),
	  function(httpReq, httpRes){
		httpRes.render('debug-page');
	  });		
		
};
