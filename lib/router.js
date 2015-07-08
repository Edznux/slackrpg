var bot = require('./bot');

function routes(req,res){
	var cmd = req.body.text.substr(4);
	var full= req.body.text;

	if (bot.getUser(req) === 'slackbot') {
		return res.status(200).end();
	}
	console.log("Call = ",full);

	switch(true){

		// print gold by user
		case (/gold/.test(cmd)):
			bot.getGold(req,res);
		break;

		//help message
		case (/help/.test(cmd)):
			bot.getHelp(req,res);
		break;

		case (/top/.test(cmd)):
			subRouteTop(req,res);
		break;

		//default message (motd like)
		default:
			bot.getRpg(req,res);
		break;
	}
}
module.exports = routes;

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