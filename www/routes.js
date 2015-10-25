var express = require('express');

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

}
