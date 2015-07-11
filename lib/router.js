var bot = require('./bot');
var slack = bot.getSlack();
var admin = require("./admin");

function routes(message){
	var full= message.text;

	if (bot.getUser(message) === 'slackbot') {
		console.log("user == slackbot");
		return;
	}
	if (bot.getUser(message) === slack.self.name) {
		console.log("user == ",slack.self.name);
		return;
	}

	args = full.split(/ +/);

	console.log("full cmd = ",full);
	console.log("main arg0",args[0]);
	console.log("main arg1",args[1]);
	console.log("main arg2",args[2]);
	console.log("main arg3",args[3]);
	console.log("main arg4",args[4]);
	console.log("main arg5",args[5]);

	switch(args[1]){

		// print gold by user
		case "gold":
			subRouteGold(message);
		break;
		case "admin":
			bot.isAdmin(bot.getUserId(message),function(isAdmin){
				if(isAdmin){
					admin(message);
				}
			});
		break;
		//help message
		case "help":
			bot.getHelp(message);
		break;

		case "top":
			subRouteTop(message);
		break;
		case "game":
			subRouteGame(message);
		break;
		case "class":
			subRouteClass(message);
		break;

		//default message (motd like)
		default:
			bot.getRpg(message);
		break;
	}
}
module.exports = routes;

function subRouteGold(message){

	var full= message.text;
	args = full.split(/ +/);
	
	console.log("full cmd = ",full);

	console.log("sub route gold", full);
	console.log("sub route gold arg 0",args[0]);
	console.log("sub route gold arg 1",args[1]);
	console.log("sub route gold arg 2",args[2]);
	console.log("sub route gold arg 3",args[3]);
	console.log("sub route gold arg 4",args[4]);
	
	switch(args[2]){
		case "give":
			// username
			if(args[3]){
				//amount
				if(args[4]){
					bot.giveGoldFromTo(message,bot.getUserId(message),slack.getUserByName(args[3]).id,args[4]);
				}else{
					bot.sendMsg("Vous devez remplir le montant",message);
				}
			}else{
				bot.getHelp(message);
			}
		break;
		default:
			bot.getGold(message);
		break;
	}
}
function subRouteClass(message){

	var full= message.text;
	args = full.split(/ +/);
	
	console.log("sub route class", full);
	console.log("sub route class arg 0",args[0]);
	console.log("sub route class arg 1",args[1]);
	console.log("sub route class arg 2",args[2]);
	console.log("sub route class arg 3",args[3]);
	console.log("sub route class arg 4",args[4]);

	switch(args[2]){
		case "list":
			bot.getClasses(message);
		break;
		case "set":
			// if "rpg class set xxx" set class to the curent player
			if(args[3]){
				bot.setClass(message,args[3],100);
			}else{
				bot.getRpg(message);
			}
		break;
		case "help":
			bot.getHelpClass(message);
		break;
		case undefined:
			bot.getClassNameByUserName(message);
		break;
		default:
			bot.getRpg(message);
		break;
	}

}

function subRouteGame(message){
	var cmd = message.text;
	if(cmd.split(' ')[2] == "list"){
		bot.getAvailGames(message);
	}else{
		bot.playGame(message);
	}
}

function subRouteTop(message){
	var subcmd = message.text.substr(8);
	var cmd = message.text.substr(4);
	var full= message.text;

	bot.getClassesList(function(classes){
		var c = [];
		for(var i=0;i<classes.length;i++){
			c.push(classes[i].class_name);
		}
		console.log("liste=",c);
	
		switch(true){
			case subcmd == "":
				bot.getTop(message);
			break;
			case subcmd == "help":
				bot.getHelpTop(message);
			break;

			case c.indexOf(subcmd) >= 0:
				bot.getTopByClass(message,subcmd);
			break;
			
			default:
				bot.getHelpTop(message);
			break;
		}
	});
}