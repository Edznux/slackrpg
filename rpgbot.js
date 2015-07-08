var db = require('./lib/db');
var router = require('./lib/router');
var bot = require('./lib/bot');
db.connect();

module.exports = function (req, res, next) {

	var userName = bot.getUser(req);
	console.log('userName : ',userName);
	
	if(!userName){
		console.log('no user name');
		res.status(200).json({text:"No nickname"});
	}

	db.getUserByName(userName,function(exist){
		console.log('User By Name');

		if(!exist){
			db.createUser(userName,"citizen",0,function(result){
				console.log('Create user :');
				console.log(result);
			});
		}

		router(req,res);
	})
}