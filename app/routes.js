
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
		//.get(isLoggedIn, function (req, res) {
		//	res.sendFile(path + '/public/index.html');
		});


		
		
};
