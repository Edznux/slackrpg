var bot = require("../lib/bot");
var gameName = "Le jeux du Random",
	name = "rnd",
	file = "rnd.js";

module.exports = function(req,res,games,cmd){
	
	games.rnd = function(){};
	for(var i=0;i<games.list.length;i++){
		if(games.list[i].name !== name){
			games.list.push({"gameName":gameName,"name":name,"file":file});
		}
	}

	games.rnd = {

		getName : function (){
			return "Jeux du Random";
		},
		getRnd : function(req,res){
			res.status(200).json({
				"text" : bot.getUser(req)+" à tiré : "+ Math.floor( Math.random()*100 +1)
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

			// if(arg1 === "list"){
			// 	console.log("registerGame"+cmd);
			// 	registerGame(games);
			// }
			switch(arg2){
				case "join":
					joinGame(req,res,bot.getUser(req));
				break;

				case "create":
					console.log('rpg game rnd create');
					if(arg3){
						console.log('CREATE THE GAME');
						createGame(req,res,bot.getUser(req),arg3);
					}else{
						getHelp(req,res);
					}
				break;

				case "gen":
					this.getRnd(req,res);
				break;

				case "help":
					getHelp(req,res);
				break;
				case "rules":
					getRules(req,res);
				break;

				default:
					console.log("default route");
				break;
			}
		}
	}

	return games;
}


function joinGame(req,res,user_name){
	res.status(200).json({'text':user_name + " join the game"});
}

function createGame(req,res,user_name,gold){
	res.status(200).json({"text":"["+gameName.toUpperCase()+"] "+user_name + " create the game. Starting with " + gold +" gold "})
}

function getHelp(req,res){
	var help = [
				"Bienvenue dans " + gameName,
				"rpg game "+ name + " create <gold>: Crée une nouvelle partie avec <gold> au depart",
				"rpg game "+ name + " join : Rejoindre la partie en cours",
				"rpg game "+ name + " quit : Quitter la partie en cours",

				].join('\n'); 

	res.status(200).json({"text":help});
}

function getRules(req,res){
	var rules = [
				"Règles du jeux",
				"Après avoir rejoind une partie [rpg game rnd join] et avant l'ecoulement du timer,",
				"chaque participant doit tirer un nombre aléatoire compris entre 0 et 100 [tpg game rnd gen]",
				"La personne ayant le plus petit nombre donne la mise a celui qui a le plus grand nombre.",
				"Les autres personne du groupes ne sont donc pas concernée.",
				"Certain de ces nombre ont neanmoins des propriété particuliere que voici :",
				"1 : le propriétaire donne la mise a TOUS les participants",
				"2 : Le tireur donne 1/100 de la mise a tout les participants",
				"13 : Chiffre le plus petit, remplace la personne ayant le plus petit nombre, les tours suivant doivent etre misé double",
				"99 : Tous les joueurs donne 1/100eme de la mise au tireur, les autres chiffre (autre que 1 et 100) sont annulé ",
				"100 : TOUS les participants donne la mise au propriétaire",
				"Egalité entre 2 membres : double la mise et re-tirage"
			].join('\n');
	res.status(200).json({"text":rules});
}

function initTimer(req,res,duration,callback){
	var duration = duration || 30;

	setInterval(function(){
		duration--;
		if(duration < 0){
			callback();
			// res.status(200).json({"text":"No time left!"});
		}
	},1000)
}