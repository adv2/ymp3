/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

//20170610 
var express = require('express');
var spawn = require('child_process').spawn;

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	
	// 20170611 require: npm install body-parser --save
	var bodyParser = require("body-parser");
	app.use(bodyParser.urlencoded({ extended: false }));

	// Views
	app.get('/', routes.views.index);
	
	app.get('/process_get', function (req, res) {
		//npm install socket.io
		
		// Prepare output in JSON format
		var linkToCheck = req.query.linkToSubmit;
		//var parser = document.createElement('a');
		//parser.href = linkToCheck;
		
		console.log( `THIS IS RESULT: ${linkToCheck}` );
			   
		const spawn = require('child_process').spawn;
		//const ls = spawn('nice', ['youtube-dl', '-e', linkToCheck, __dirname]);
		const ls = spawn('nice', ['sh', 'yd-starter.sh', linkToCheck, '/home/support/my-test-project/ymp3' ]);

		ls.stdout.on('data', (data) => {
		  console.log(`stdout: ${data}`);
		  var str = data.toString();
		  res.write(str + "\n");
		});

		ls.stderr.on('data', (data) => {
		  console.log(`stderr: ${data}`);
		});
		ls.on('close', (code) => {
		  console.log(`child process exited with code ${code}`);
		});
		
		response = {
		  linkToSubmit:req.query.linkToSubmit,
		  
		};
		console.log(response);
		
		ls.stdout.pipe(res);
		
		//res.end(JSON.stringify(response));
	   
	})
	
	app.get('/blog', function (req, res) {
		res.send('Hello World!'
		+ '<ul>'
		+ '<li>Download <a href="/blog/amazing.txt">amazing.txt</a>.</li>'
		+ '<li>Download <a href="/blog/missing.txt">missing.txt</a>.</li>'
		+ '</ul>'
		+ __dirname
		+ '<form method="post" enctype="multipart/form-data" action="/link-upload">'
		+ '	<input type="text" name="username">'
		+ '	<input type="submit">'
		+ '</form>'
		);
	});
	
	app.get('/blog/:file(*)', function(req, res, next){
	  var file = req.params.file
		, path = __dirname + '/../public/files/' + file;

	  res.download(path);
	});
	
				
	app.post('/result', function(req, res){
		console.log(req.body.customer.name);
		console.log(req.body.customer.email);
		console.log(req.body.customer.phone);
		var name = req.body.customer.name;
		res.send(name + ' Submitted Successfully!');
	});	
	

	
	app.use(function(err, req, res, next){
	  // special-case 404s,
	  // remember you could
	  // render a 404 template here
	  if (404 == err.status) {
		res.statusCode = 404;
		res.send('Cant find that file, sorry!');
	  } else {
		next(err);
	  }
	});

	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};

