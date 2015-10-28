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
		if( (new RegExp(regexp, "i").test(message.text)) ){

			trigger_used = message.text.match(regexp);
			console.log(trigger_used);
			args = message.text.split(new RegExp(trigger_used, "i"));
			console.log(args);
			switch(args[1]){
				case "":
					bot.sendMsg("Bonne nuit à tous !", message);
				break;
				default:
					bot.sendMsg("Bonne nuit "+args[1]+" :) <3", message);
				break;
			}
		}
	});
}
module.exports.router = router;