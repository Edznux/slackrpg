var express = require('express');
var db = require('../lib/db');
var commands = require('../lib/commands.js'); // "controller"

module.exports = function(app) {
	// define the public directory for serve static files
	app.use(express.static('www/public'));
	//load ejs rendering
	app.set('view engine', 'ejs');
	// load the ejs template from the www/pages folder
	app.set('views', __dirname + '/pages');

	app.get("/", function(req,res){
		res.render("index.ejs");
	});

/*	app.get("/login", function(req,res){
		res.render('login.ejs');
	});

	app.post('/login', passport.authenticate('local-login', {
															successRedirect : '/profile', // redirect to the secure profile section
															failureRedirect : '/login', // redirect back to the signup page if there is an error
		}),
		function(req, res) {
			console.log("hello");

			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 3;
			} else {
				req.session.cookie.expires = false;
			}
			res.redirect('/');
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
*/	
	app.get("/classes", function(req,res){
		db.getClasses(function(cmds){
			console.log(cmds);
			res.render("classes.ejs", {title: "Slack RPG: Classes", commands: cmds});
		});
	});

	app.get("/commands", function(req,res){
		commands.getFullCommands(function(cmds){
			console.log(cmds);
			res.render("commands.ejs", {title: "Slack RPG: Commands", commands: cmds});
		});
	});

	app.post("/commands/:id", function(req,res){
		console.log("start modifying command id : ", req.params.id);
		res.send('ok');
	});

	app.get("/commands/:id/enable", function(req,res){
		commands.toggleStatus(req.params.id,function(data){
			console.log("Enable or disable command id : ", req.params.id);
			res.send('ok');
		});
	});
	
	app.get("/commands/:id/name", function(req,res){
		console.log("NAAAMME",req.query.name);
		commands.changeName(req.params.id, req.query.name, function(data){
			console.log("Change name of command id : ", req.params.id);
			res.send('ok');
		});
	});

	app.get("/commands/:id/file_name", function(req,res){
		console.log("FILLLEENAAAMME",req.query.file_name);
		commands.changeFileName(req.params.id, req.query.file_name, function(data){
			console.log("Change file name of command id :", req.params.id);
			res.send('ok');
		});
	});
}

/*// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}*/