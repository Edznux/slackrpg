var bot = require('./bot');

function routes(req,res){

	if (bot.getUser(req) === 'slackbot') {
		return res.status(200).end();
	}

	switch(req.body.text.substr(4)){

		// print gold by user
		case "gold":
			bot.getGold(req,res);
		break;

		//help message
		case "help":
			bot.getHelp(req,res);
		break;

		case "top":
			bot.getTop(req,res);
		break;
		//default message (motd like)
		default:
			bot.getRpg(req,res);
		break;
	}
}
module.exports = routes;