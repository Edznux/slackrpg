var bot = require('./bot');
var spawn = require('child_process').spawn;
var slack = bot.getSlack();

function admin(message){
	var full= message.text;
	args = full.split(/ +/);
	
	console.log("sub route admin =====", full);
	console.log("sub route admin arg 0",args[0]);
	console.log("sub route admin arg 1",args[1]);
	console.log("sub route admin arg 2",args[2]);
	console.log("sub route admin arg 3",args[3]);
	console.log("sub route admin arg 4",args[4]);
	console.log("sub route admin arg 5",args[5]);

	switch(args[2]){
		case "class":
			if(args[3] == "add"){
				if(args[4]){
					// "rpg admin class add".length == 20;
					// arg4.length + 1 => add white space after the class name
					var description = full.substr(20+args[4].length+1);
					bot.addClass(message,args[4], description);
				}
			}
		break;
		case "help":
			bot.getHelpAdmin(message);
		break;
		case "gold":
			if(args[3] == "give"){
				console.log(slack.getUserByName(args[4]),args[5]);
				bot.giveGold(message,slack.getUserByName(args[4]).id,args[5]);
			}else{

			}
		break;
		case "update":
			/*
			* this command will pull last version on the master branch
			* If this application use nodemon, (npm install nodemon && nodemon app.js), it will restart automatically
			*/
			var gitpull = spawn('git',['pull','origin','master']);
			var data ="";
			gitpull.stdout.on('data',function(d){
				data+=d;
			});
			gitpull.stdout.on("close",function(){
				bot.sendMsg(data,message);
				console.log(data);
			});
		break;

		default:
			bot.getHelpAdmin(message);
		break;
	}

}
module.exports = admin;