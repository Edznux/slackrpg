var bot = require("../lib/bot");
var gameName = "Le jeux du Random",
	name = "rnd",
	file = "rnd.js",
	members = [],
	duration = 0,
	game_gold = 0;

module.exports = function(message,games,cmd){
	games.rnd = function(){};
	
	if(!message){
		//just pushing to global games list
		games.list.push({"gameName":gameName,"name":name,"file":file});
	}

	games.rnd = {
		getName : function (){
			return "Jeux du Random";
		},

		getRnd : function(){
			return Math.floor( Math.random()*100 +1);
		},

		router : function(message){
			//rpg game rnd join
			//delete "game rnd"
			var cmd = message.text;
			args = cmd.split(/ +/);
			console.log(cmd);

			switch(args[3]){
				case "join":
					this.joinGame(message,bot.getUserName(message));
				break;

				case "create":
					console.log('rpg game rnd create');
					if(args[4]){
						console.log('CREATE THE GAME');
						this.createGame(message,args[4]);
					}else{
						this.getHelp(message);
					}
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
			bot.sendMsg(rules,message);
		},

		getHelp : function(message){
			var help = [
						"Bienvenue dans " + gameName,
						"rpg game "+ name + " create <gold>: Crée une nouvelle partie avec <gold> au départ.",
						"rpg game "+ name + " join : Rejoindre la partie en cours.",
						"rpg game "+ name + " gen : Effectuer son propre tirage.",
						"rpg game "+ name + " quit : Quitter la partie en cours.",
						].join('\n');

			bot.sendMsg(help,message);
		},

		createGame: function(message,gold){
			var _this = this,
				d = 30,
				game_gold = gold;
			
				duration = 30;

			bot.sendMsg("["+gameName.toUpperCase()+"] "+bot.getUserName(message) + " create the game. Starting with " + gold +" gold ",message);
			if(this.getMembers().length > 0){
				bot.sendMsg("Vous ne pouvez pas créer de partie car une partie est déja en cours",message);
				return;
			}
			
			this.joinGame(message, bot.getUserName(message));
			this.initTimer(message, d, function(){
				bot.sendMsg("Fin des inscriptions",message);
				_this.winnerTimer(message, function(){
					bot.sendMsg('Désigner le vainqueur et répartisser vous les gains',message);
					_this.resetMembers();
				});
			});
		},

		joinGame: function(message,user_name){
			console.log('join game at duration ==',duration);
			if(duration > 0){
				if(!this.getMemberByName(user_name)){
					this.addMember(user_name);
					roll = this.getMemberByName(user_name).roll;
					bot.sendMsg(user_name + " à rejoint la partie et à tiré : "+ roll +"\n [rpg game rnd join] pour rejoindre la partie, ("+duration+" secondes avant la fin des inscriptions)", message);
				}else{
					bot.sendMsg("Vous avez déjà rejoint la partie",message);
				}
			}else{
				bot.sendMsg("Vous ne pouvez pas rejoindre de partie",message);
			}
		},

		initTimer: function(message,d,callback){
			duration = d || 30;
			var _this = this;
			var timer = setInterval(function(){
				duration--;
				console.log(duration);
				console.log(_this.getMembers());
				if(duration == 10){
					bot.sendMsg("Fin des inscriptions dans 10 secondes",message);
				}

				if(duration <= 0){
					clearInterval(timer);
					callback();
				}

			},1000);
		},

		winnerTimer: function(message,callback){
			var dt = 5;
			var timer = setInterval(function(){
				dt--;
				if(dt == 0){
					clearInterval(timer);
					callback();
				}
			},1000);
		},

		addMember: function(user_name){
			member= {
						user_name:user_name,
						roll: this.getRnd()
					};
			if(!this.getMemberByName(user_name)){
				console.log('pushed',member);
				members.push(member);
			}else{
				console.log('User already in the members list');
			}
		},

		getMembers: function(){
			return members;
		},

		getMemberByName: function(user_name){
			for(var name in members){
				console.log("name = ",members[name]);
				console.log("user_name = ",members[name].user_name);
				if(members[name].user_name == user_name){
					console.log("getMemberByName returned =",members[name]);
					return members[name];
				}else{
					return false;
				}
			}
		},
		resetMembers : function(){
			members = [];
		}
	};
	return games;
};


