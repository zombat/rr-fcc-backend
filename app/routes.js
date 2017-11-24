
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
		} else if(httpReq.query.pollID && httpReq.query.voteCast){
			mongo.connect(MONGO_URI, function(err, db) {
				db.collection('fcc-polls', function (err, collection) {   
					collection.updateOne({ '_id' : require('mongodb').ObjectID(httpReq.query.pollID), 'pollChoices.choiceName': httpReq.query.voteCast }, { '$inc' : { 'pollChoices.$.voteCount': 1  } } ).then(function(document) {
						if(document){
							httpRes.setHeader('Content-Type', 'application/json');
							httpRes.end(JSON.stringify(document));
						}
						db.close();
				  });
				});
			});
		} else if(httpReq.query.pollID && httpReq.query.customResponse && httpReq.query.customColor){
			mongo.connect(MONGO_URI, function(err, db) {
				db.collection('fcc-polls', function (err, collection) {      
					collection.updateOne({ '_id' : require('mongodb').ObjectID(httpReq.query.pollID) }, { '$push' : { 'pollChoices' : { 'choiceName' : httpReq.query.customResponse.toString(), 'voteCount' : 1, 'voteColor' : httpReq.query.customColor.toString() } } } ).then(function(document) {
						if(document){
							httpRes.setHeader('Content-Type', 'application/json');
							httpRes.end(JSON.stringify(document));
						}
						db.close();
				  });
				});
			});
		} else if(httpReq.query.pollID){
			mongo.connect(MONGO_URI, function(err, db) {
				db.collection('fcc-polls', function (err, collection) {      
					collection.findOne({ '_id' : require('mongodb').ObjectID(httpReq.query.pollID) }).then(function(document) {
						if(document){
							httpRes.setHeader('Content-Type', 'application/json');
							httpRes.end(JSON.stringify(document));
						}
						db.close();
				  });
				});
			});
		} else if(httpReq.query.myPolls) {
			mongo.connect(MONGO_URI, function(err, db) {
				var tempVar;
				db.collection('fcc-polls', function (err, collection) {      
					collection.find({ 'pollOwner' : httpReq.user.id.toString() },{'_id': 1, 'pollTitle': 1}).toArray(function(err, documents) {
						if(err) throw err;
							httpRes.setHeader('Content-Type', 'application/json');
							httpRes.end(JSON.stringify(documents));
							db.close();
					});	
				});
			});
		}
	});
	
	app.get('/submit-poll',
	  require('connect-ensure-login').ensureLoggedIn(),
	  function(httpReq, httpRes){
		  if(httpReq.query.newPoll && httpReq.query.pollName && httpReq.query.pollChoices){
			
			console.log(httpReq.query);
			var newPollDocument = {
					pollTitle : httpReq.query.pollName,
					pollOwner : httpReq.user.id.toString(),
					pollChoices : []
				};
			var choiceArray = JSON.parse(httpReq.query.pollChoices);
			choiceArray.forEach(function(pollChoice){
				newPollDocument.pollChoices.push( {
					choiceName : pollChoice[0],
					voteCount : 0,
					voteColor : pollChoice[1]
				});
			});
				console.log(newPollDocument);	
			mongo.connect(MONGO_URI, function(err, db) {
				db.collection('fcc-polls', function (err, collection) {      
					collection.insertOne( newPollDocument ).then(function(document) {
						if(document){
							httpRes.setHeader('Content-Type', 'application/json');
							httpRes.end(JSON.stringify(document));
						}
						db.close();
				  });
				});
			});
		}
	  });
		
	app.get('/delete-poll',
	 require('connect-ensure-login').ensureLoggedIn(),
	  function(httpReq, httpRes){
		  if(httpReq.query.pollID){
			  mongo.connect(MONGO_URI, function(err, db) {
				db.collection('fcc-polls', function (err, collection) {   
					collection.findOne({ '_id' : require('mongodb').ObjectID(httpReq.query.pollID)} ).then(function(document) {
						if(document){
							if(document.pollOwner == httpReq.user.id){
								mongo.connect(MONGO_URI, function(err, db) {
									db.collection('fcc-polls', function (err, collection) {      
										collection.deleteOne({ '_id' : require('mongodb').ObjectID(httpReq.query.pollID)}).then(function(document) {
											if(document){
												httpRes.setHeader('Content-Type', 'application/json');
												httpRes.end(JSON.stringify(document));
											}
											db.close();
									  });
									});
								});
							} else {
								httpRes.setHeader('Content-Type', 'application/json');
								httpRes.end(JSON.stringify({ 'error' : 'This is not your poll' }));
							}
						}
						db.close();
				  });
				});
			});
		  }
		  
		  
		  
	 });	
		
	app.get('/get-user',
	  require('connect-ensure-login').ensureLoggedIn(),
	  function(httpReq, httpRes){
		httpRes.setHeader('Content-Type', 'application/json');
		httpRes.end(JSON.stringify(httpReq.user));
	 });		  
		
	app.get('/fcc-voting*', function (httpReq, httpRes) {
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
		httpRes.redirect('/fcc-voting');
	  });
	  
	app.get('/*', function (httpReq, httpRes) {
		httpRes.render('home', { user: httpReq.user } );
	});	
};
