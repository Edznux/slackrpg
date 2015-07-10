var bot = require('./bot');
var slack = bot.getSlack();

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
			subRouteGold(message);
		break;
		case "admin":
			bot.isAdmin(message,function(isAdmin){
				if(isAdmin){
					subRouteAdmin(message);
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

function subRouteAdmin(message){
	var full= message.text;
	var arg1 = full.split(' ')[1];
	var arg2 = full.split(' ')[2];
	var arg3 = full.split(' ')[3];
	var arg4 = full.split(' ')[4];
	var arg5 = full.split(' ')[5];
	// "rpg admin class add".length == 20;
	// arg4.length + 1 => add white space after the class name
	if(arg4){
		var description = full.substr(20+arg4.length+1);
	}

	console.log(description);

	console.log("sub route admin", full);
	console.log("sub route admin arg 1",arg1);
	console.log("sub route admin arg 2",arg2);
	console.log("sub route admin arg 3",arg3);
	console.log("sub route admin arg 4",arg4);
	console.log("sub route admin arg 5",arg5);
	switch(arg2){
		case "class":
			if(arg3 == "add"){
				bot.addClass(message,arg4, description);
			}
		break;
		case "help":
			bot.adminHelp(message);
		break;
		default:
			bot.getHelp(message);
		break;
	}

}
function subRouteGold(message){

	var full= message.text;
	var arg1 = full.split(' ')[1];
	var arg2 = full.split(' ')[2];
	var arg3 = full.split(' ')[3];
	var arg4 = full.split(' ')[4];

	console.log("sub route gold", full);
	console.log("sub route gold arg 1",arg1);
	console.log("sub route gold arg 2",arg2);
	console.log("sub route gold arg 3",arg3);
	console.log("sub route gold arg 4",arg4);
	
	switch(arg2){
		case "give":
			// username
			if(arg3){
				//amount
				if(arg4){
					bot.giveGold(message,bot.getUserName(message),arg3,arg4);
				}else{
					bot.sendMsg("Vous devez remplir le montant",message.channel);
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
	var arg1 = full.split(' ')[1];
	var arg2 = full.split(' ')[2];
	var arg3 = full.split(' ')[3];
	var arg4 = full.split(' ')[4];
	console.log("sub route class", full);
	console.log("sub route class arg 1",arg1);
	console.log("sub route class arg 2",arg2);
	console.log("sub route class arg 3",arg3);

	switch(arg2){
		case "list":
			bot.getClasses(message);
		break;
		case "set":
			// if "rpg class set xxx" set class to the curent player
			if(arg3){
				bot.setClass(message,arg3,100);
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

	if(cmd.split(' ')[1] == "list"){
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