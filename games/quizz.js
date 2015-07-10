var bot = require("../lib/bot");

var gameName = "Quizz",
	name = "quizz",
	file = "quizz.js",

	currentQuestion = -1,
	nbTry = 0,
	nbTryMax = 10;

module.exports = function(message,games,cmd){
	
	games.quizz = function(){};

	if(!req && !res){
		console.log('req and res == null => loadGame function called');
		games.list.push({"gameName":gameName,"name":name,"file":file});
	}

	games.quizz = {
		router:function(message){
			var cmd = message.text.substr(4);
			console.log("nbTry =",nbTry,"nbTryMax",nbTryMax,"currentQuestion",currentQuestion);

			var arg1 = cmd.split(' ')[1];
			var arg2 = cmd.split(' ')[2];
			var arg3 = cmd.split(' ')[3];
			var arg4 = cmd.split(' ')[4];

			var userRes = message.text.substr(19).toLowerCase().trim();
			
			console.log(cmd);
			console.log("quizz arg1",arg1);
			console.log("quizz arg2",arg2);
			console.log("quizz arg3",arg3);
			console.log("quizz arg4",arg4);

			switch(arg2){
				case "create":
					console.log('rpg game quizz create');
					console.log(currentQuestion);
					if(currentQuestion == -1){
						q = this.getRnd(message);
						currentQuestion = q.id;
						console.log('nouvelle question =',q.question);
						bot.sendMsg(q.question,message.channel);
						// res.status(200).json({'text':q.question});
					}else{
						bot.sendMsg("Une question est déjà en cours ("+nbTry+"essai(s) / "+nbTryMax+")",message.channel);
					}
				break;
				
				case "res":
					console.log("currentQuestion res",currentQuestion);
					console.log(this);
					console.log("getRes(",this.getRes(currentQuestion),") res ",this.getRes(currentQuestion));
					
					nbTry++;
					if(nbTry == nbTryMax){
						nbTry = 0;
						currentQuestion = -1;
					}

					if(currentQuestion == -1){
						bot.sendMsg("Il n'y a pas de question en cours",message.channel);
					}else{
						if(this.getRes(currentQuestion).indexOf(userRes) >= 0){
							bot.sendMsg("GGWP bonne réponse ! "+bot.getUserName(message), message.channel);
						}else{
							bot.sendMsg("Mauvais réponse "+bot.getUserName(message), message.channel);
						}
					}
				break;

				case "help":
					this.getHelp(message);
				break;
				
				case "rules":
					this.getRules(message);
				break;

				default:
					this.getHelp(message);
					console.log("default quizz route");
				break;
			}
		},
		getQuizz: function(message){
			return [
				{"id":1,"question":"Quel est la réponse à La grande question sur la vie, l'univers et le reste ?", "response":["42"]},
				{"id":2,"question":"Qui est l'auteur de ce bot ?", "response":["édouard","edouard"]},
				{"id":3,"question":"Quel est la valeur max d'un integer (32 bit) ?", "response":['4294967295','4 294 967 295']},
			];
		},
		getRnd : function(message){
			var nbq = this.getQuizz().length;
			var questionNo = Math.floor(Math.random()*nbq);
			currentQuestion = questionNo;
			return this.getQuizz()[questionNo];
		},
		getRes:function(questionNo){
			return this.getQuizz()[questionNo].response;
		},
		getRules: function(message){
			var rules = [
					"Règles du jeu",
					"Une fois le quizz lancé avec [rpg game quizz create],",
					"les participants répondent dans le chat sous la forme [rpg game quizz res <réponse à la question>].",
					"Le premier partipant ayant la bonne réponse remporte la partie.",
				].join('\n');
			bot.sendMsg(rules, message.channel);
		},
		getHelp : function(message){
			var help = [
					"Bienvenue dans " + gameName,
					"rpg game "+ name + " create : Nouvelle question",
					"rpg game "+ name + " res : Répondre à la question en cours",
				].join('\n'); 
			bot.sendMsg(help, message.channel);
		}
	};
	return games;
}