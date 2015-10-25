var bot = require('../bot');
var slack = bot.getSlack();

function router(message){
	args = message.text.split(/ +/);
	if(args[0] === "bn"){
		switch(args[1]){
			case undefined:
				bot.sendMsg("Bonne nuit all", message);
			break;
			default:
				bot.sendMsg("Bonne nuit "+args[1], message);
			break;
		}
	}
}
module.exports.router = router;