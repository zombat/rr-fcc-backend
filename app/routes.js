
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
		
	app.route('/test')
		.get(isLoggedIn, function (httpReq, httpRes) {
			httpRes.render('debug-page');
		});
		
		
	
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

		
		
};
