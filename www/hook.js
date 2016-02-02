var express = require('express');
var bodyParser = require('body-parser');
var math = require('mathjs');
var slack = require('../lib/bot').getSlack();
module.exports = function(app) {
	// parse application/x-www-form-urlencoded 
	app.use(bodyParser.urlencoded({ extended: false }));

	// parse application/json 
	app.use(bodyParser.json());

	app.post("/hook/math", function(req,res){
		var cmd = req.body;
		var result, channel, rnd;
		var resPossible = ["42","dieu","maître","Créateur"];
		var isFake = false;
		var isPublic = false;
		if(cmd.text.match(/all/)){
			isPublic = true;
			cmd.text = cmd.text.replace("all", "");
		}
		if(cmd.text.match(/doudou/)){
			isFake = true;
			cmd.text = cmd.text.replace("doudou", "");
		}
		result = math.eval(cmd.text);

		if(isFake){
			rnd = Math.floor(Math.random()*resPossible.length+1);
			result = resPossible[rnd];
		}

		if(isPublic){
			channel = slack.getChannelGroupOrDMByID(cmd.channel_id);
			res.send("ok, posting to public");
			channel.send(cmd.text + " = " + result);	
		}
		


		res.send(cmd.text + " = " + result);
	});
}