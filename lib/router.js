var bot = require('./bot');

function routes(req,res){
	var cmd = req.body.text.substr(4);
	var full= req.body.text;

	if (bot.getUser(req) === 'slackbot') {
		return res.status(200).end();
	}
	console.log("full cmd = ",full);
	var arg1 = full.split(' ')[1];
	var arg2 = full.split(' ')[2];
	var arg3 = full.split(' ')[3];
	var arg4 = full.split(' ')[4];
	console.log("main arg1",arg1);
	console.log("main arg2",arg2);
	console.log("main arg3",arg3);
	console.log("main arg4",arg4);

	switch(arg1){

		// print gold by user
		case "gold":
			bot.getGold(req,res);
		break;

		//help message
		case "help":
			bot.getHelp(req,res);
		break;

		case "top":
			subRouteTop(req,res);
		break;
		case "game":
			subRouteGame(req,res,cmd);
		break;

		//default message (motd like)
		default:
			bot.getRpg(req,res);
		break;
	}
}
module.exports = routes;

function subRouteGame(req,res,cmd){
	console.log("cmmd============"+cmd);
	if(cmd.split(' ')[1] == "list"){
		bot.getAvailGames(req,res,cmd);
	}else{
		bot.playGame(req,res,cmd);
	}
}

function subRouteTop(req,res){

var subcmd = req.body.text.substr(8);
var cmd = req.body.text.substr(4);
var full= req.body.text;

	switch(subcmd){
		case "":
			bot.getTop(req,res);
		break;
		case "citizen":
			bot.getTopByClass(req,res,"citizen");
		break;
		default:
			bot.getRpg(req,res);
		break;
	}

}