
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

	app.get('/vote-api', function (httpReq, httpRes) {
		if(httpReq.query.pollList){
			mongo.connect(MONGO_URI, function(err, db) {
				var tempVar;
				db.collection('fcc-polls', function (err, collection) {      
					collection.find({},{'_id': 1, 'pollTitle': 1}).toArray(function(err, documents) {
						if(err) throw err;
							httpRes.setHeader('Content-Type', 'application/json');
							httpRes.end(JSON.stringify(documents));
							db.close();
					});	
				});
			});
		} else if(httpReq.query.pollID){
			mongo.connect(MONGO_URI, function(err, db) {
				var tempVar;
				db.collection('fcc-polls', function (err, collection) {      
					collection.findOne({ '_id' : require('mongodb').ObjectID(httpReq.query.pollID) }).then(function(document) {
						if(document){
							httpRes.setHeader('Content-Type', 'application/json');
							httpRes.end(JSON.stringify(document));
						}
						db.close();
				  });
					
					/*
					.toArray(function(err, documents) {
						if(err) throw err;
							httpRes.setHeader('Content-Type', 'application/json');
							httpRes.end(JSON.stringify(documents));
							db.close();
					});	
					*/
				});
			});
		}
	});

		
	app.get('/fcc-voting', function (httpReq, httpRes) {
		httpRes.render('fcc-voting', { user: httpReq.user } );
	});
		
	app.route('/login')
		.get(function (httpReq, httpRes) {
			if(httpReq.user){	
				httpRes.render('home', { user: httpReq.user } );
			} else {
				httpRes.render('login', { user: httpReq.user });
			}
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
		httpRes.render('debug-page', { user: httpReq.user });
	  });		


	  
	  
	app.get('/*', function (httpReq, httpRes) {
		httpRes.render('home', { user: httpReq.user } );
	});	
};
