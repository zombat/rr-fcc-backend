const express = require('express'),
	passport = require('passport'),
	httpPort = process.env.PORT || 80,
	routes = require('./app/routes.js'),
	app = express();	
	
// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Allow access to /public
app.use('/public', express.static(process.cwd() + '/public'));

// Set routes and start server.	
routes(app, passport);	
app.listen(httpPort);
console.log('HTTP listening on port ' + httpPort);