var bot = require('../bot');
var slack = bot.getSlack();
var db = require('../db.js');

function router(message){
	args = message.text.split(/ +/);

	db.getTriggersForCommandName("Good Night", function(triggers){

		var triggers_list = [];

		for (var i = 0; i < triggers.length; i++) {
			triggers_list.push(triggers[i].name);
		}

		// add regexp on every triggers listed on the database
		var regexp = "^" + triggers_list.join('|');
		if( (new RegExp(regexp).test(message.text)) ){

			args = message.text.split(regexp);
			console.log(args);
			switch(args[1]){
				case undefined:
					bot.sendMsg("Bonne nuit all", message);
				break;
				default:
					bot.sendMsg("Bonne nuit "+args[1], message);
				break;
			}
		}
	});
}
module.exports.router = router;