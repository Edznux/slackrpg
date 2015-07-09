var bot = require("../lib/bot");
var gameName = "Le jeu du Random",
	name = "rnd",
	file = "rnd.js";

module.exports = function(req,res,games,cmd){
	
	games.rnd = function(){};
	
	if(!req && !res){
		console.log('req and res == null => loadGame function called');
		games.list.push({"gameName":gameName,"name":name,"file":file});
	}

	games.rnd = {

		getName : function (){
			return "Jeu du Random";
		},
		getRnd : function(req,res){
			res.status(200).json({
				"text" : bot.getUser(req)+" a tiré : "+ Math.floor( Math.random()*100 +1)
			});
		},
		router : function(req,res){
			//rpg game rnd join
			//delete "game rnd"
			var cmd = req.body.text.substr(4);

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
					joinGame(req,res,bot.getUser(req));
				break;

				case "create":
					console.log('rpg game rnd create');
					if(arg3){
						console.log('CREATED THE GAME');
						createGame(req,res,bot.getUser(req),arg3);
					}else{
						this.getHelp(req,res);
					}
				break;

				case "gen":
					this.getRnd(req,res);
				break;

				case "help":
					this.getHelp(req,res);
				break;
				case "rules":
					this.getRules(req,res);
				break;
				case "":
					this.getHelp(req,res);
				break;
				default:
					this.getHelp(req,res);
					console.log("default quizz route");
				break;
			}
		},
		getRules: function(req,res){
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
			res.status(200).json({"text":rules});
		},
		getHelp : function(req,res){
			var help = [
						"Bienvenue dans " + gameName,
						"rpg game "+ name + " create <gold>: Crée une nouvelle partie avec <gold> au départ.",
						"rpg game "+ name + " join : Rejoindre la partie en cours.",
						"rpg game "+ name + " gen : Effectuer son propre tirage.",
						"rpg game "+ name + " quit : Quitter la partie en cours.",

						].join('\n'); 

			res.status(200).json({"text":help});
		}
	};
	return games;
};


function joinGame(req,res,user_name){
	res.status(200).json({'text':user_name + " join the game"});
}

function createGame(req,res,user_name,gold){
	res.status(200).json({"text":"["+gameName.toUpperCase()+"] "+user_name + " created the game. Starting with " + gold +" gold "});
}

function initTimer(req,res,duration,callback){
	var duration = duration || 30;

	setInterval(function(){
		duration--;
		if(duration < 0){
			callback();
			// res.status(200).json({"text":"No time left!"});
		}
	},1000);
}