var bot = require("../lib/bot");
var gameName = "Le jeux du Random",
	name = "rnd",
	file = "rnd.js";

module.exports = function(message,games,cmd){
	
	games.rnd = function(){};
	
	if(!req && !res){
		console.log('req and res == null => loadGame function called');
		games.list.push({"gameName":gameName,"name":name,"file":file});
	}

	games.rnd = {

		getName : function (){
			return "Jeux du Random";
		},
		getRnd : function(message){
			bot.sendMsg(bot.getUserName(message)+" à tiré : "+ Math.floor( Math.random()*100 +1), message.channel);
		},
		router : function(message){
			//rpg game rnd join
			//delete "game rnd"
			var cmd = message.text.substr(4);

			var arg1 = cmd.split(' ')[1];
			var arg2 = cmd.split(' ')[2];
			var arg3 = cmd.split(' ')[3];
			var arg4 = cmd.split(' ')[4];
			console.log(cmd);
			console.log("rnd arg1",arg1);
			console.log("rnd arg2",arg2);
			console.log("rnd arg3",arg3);
			console.log("rnd arg4",arg4);

			switch(arg2){
				case "join":
					joinGame(message,bot.getUserName(message));
				break;

				case "create":
					console.log('rpg game rnd create');
					if(arg3){
						console.log('CREATE THE GAME');
						createGame(message,bot.getUserName(message),arg3);
					}else{
						this.getHelp(message);
					}
				break;

				case "gen":
					this.getRnd(message);
				break;

				case "help":
					this.getHelp(message);
				break;
				case "rules":
					this.getRules(message);
				break;
				case "":
					this.getHelp(message);
				break;
				default:
					this.getHelp(message);
					console.log("default quizz route");
				break;
			}
		},
		getRules: function(message){
			var rules = [
					"Règles du jeu",
					"Après avoir rejoint une partie [rpg game rnd join] et avant l'écoulement du timer,",
					"chaque participant doit tirer un nombre aléatoire compris entre 0 et 100 [tpg game rnd gen]",
					"La personne ayant le plus petit nombre donne la mise a celui qui a le plus grand nombre.",
					"Les autres personne du groupe ne sont donc pas concernées.",
					"Certains de ces nombres ont des propriétés particulières que voici :",
					"1 : le propriétaire donne la mise à TOUT les participants.",
					"2 : Le tireur donne 1/100ème de la mise à tout les participants.",
					"13 : Chiffre le plus petit, remplace la personne ayant le plus petit nombre, les tours suivants doivent être misés double.",
					"99 : Tous les joueurs donnent 1/100ème de la mise au tireur, les autres chiffres (autre que 1 et 100) sont annulés.",
					"100 : TOUT les participants donnent la mise au propriétaire.",
					"Égalité entre 2 membres : double la mise et re-tirage."
				].join('\n');
			bot.sendMsg(rules,message.channel);
		},
		getHelp : function(message){
			var help = [
						"Bienvenue dans " + gameName,
						"rpg game "+ name + " create <gold>: Crée une nouvelle partie avec <gold> au départ.",
						"rpg game "+ name + " join : Rejoindre la partie en cours.",
						"rpg game "+ name + " gen : Effectuer son propre tirage.",
						"rpg game "+ name + " quit : Quitter la partie en cours.",
						].join('\n'); 

			bot.sendMsg(help,message.channel);
		}
	}
	return games;
}


function joinGame(message,user_name){
	bot.sendMsg(user_name + " join the game",message.channel);
}

function createGame(message,user_name,gold){
	bot.sendMsg("["+gameName.toUpperCase()+"] "+user_name + " create the game. Starting with " + gold +" gold ",message.channel);
}

function initTimer(message,duration,callback){
	var duration = duration || 30;

	setInterval(function(){
		duration--;
		if(duration < 0){
			callback();
			// res.status(200).json({"text":"No time left!"});
		}
	},1000)
}