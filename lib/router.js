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
			subRouteGold(req,res);
		break;
		case "admin":
			bot.isAdmin(req,res,function(isAdmin){
				if(isAdmin){
					subRouteAdmin(req,res);
				}
			});
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
		case "class":
			subRouteClass(req,res);
		break;

		//default message (motd like)
		default:
			bot.getRpg(req,res);
		break;
	}
}
module.exports = routes;

function subRouteAdmin(req,res){
	var full= req.body.text;
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
				bot.addClass(req,res,arg4, description);
			}
		break;
		case "help":
			bot.adminHelp(req,res);
		break;
		default:
			bot.getHelp(req,res);
		break;
	}

}
function subRouteGold(req,res){

	var full= req.body.text;
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
					bot.giveGold(req,res,bot.getUser(req),arg3,arg4);
				}else{
					res.status(200).json({"text":"Vous devez remplir le montant"});
				}
			}else{
				bot.getHelp(req,res);
			}
		break;
		default:
			bot.getGold(req,res);
		break;
	}
}
function subRouteClass(req,res){
	var full= req.body.text;
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
			bot.getClasses(req,res);
		break;
		case "set":
			// if "rpg class set xxx" set class to the curent player
			if(arg3){
				bot.setClass(req,res,arg3,100);
			}else{
				bot.getRpg(req,res);
			}
		break;
		case "help":
			bot.getHelpClass(req,res);
		break;
		case undefined:
			bot.getClassNameByUserName(req,res);
		break;
		default:
			bot.getRpg(req,res);
		break;
	}

}

function subRouteGame(req,res,cmd){

	if(cmd.split(' ')[1] == "list"){
		bot.getAvailGames(req,res);
	}else{
		bot.playGame(req,res,cmd);
	}
}

function subRouteTop(req,res){
	var subcmd = req.body.text.substr(8);
	var cmd = req.body.text.substr(4);
	var full= req.body.text;

	bot.getClassesList(function(classes){
		var c = [];
		for(var i=0;i<classes.length;i++){
			c.push(classes[i].class_name);
		}
		console.log("liste=",c);
	
		switch(true){
			case subcmd == "":
				bot.getTop(req,res);
			break;
			case subcmd == "help":
				bot.getHelpTop(req,res);
			break;

			case c.indexOf(subcmd) >= 0:
				bot.getTopByClass(req,res,subcmd);
			break;
			
			default:
				bot.getHelpTop(req,res);
			break;
		}
	});

}