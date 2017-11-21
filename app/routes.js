
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get(function (httpReq, httpRes) {
			httpRes.render('home');
		});
		
	app.route('/auth/facebook')
		.get(function (httpReq, httpRes) {
			passport.authenticate('facebook');
		});
		
	app.route('/auth/facebook/callback')
		.get(function (httpReq, httpRes) {
			passport.authenticate('facebook', { failureRedirect: '/login' });
			// Successful authentication, redirect home.
			httpRes.redirect('/');
		});	
		
	

		
		
};
