var bot = require("../lib/bot");

module.exports = function(message,games,cmd){

var gameName = "Quizz",
	name = "quizz",
	file = "quizz.js",

	currentQuestion = -1,	// set curent question id  
	nbTry = 0,				// current try number
	nbTryMax = 10;			// maximum try, if exceeded, reset question.
	
	games.quizz = function(){};
	if(!message){
		//just pushing to global games list
		games.list.push({"gameName":gameName,"name":name,"file":file});
	}

	games.quizz = {
		router:function(message){
			var cmd = message.text;
			console.log(message.text);
			console.log(cmd);
			console.log("nbTry =",nbTry,"nbTryMax",nbTryMax,"currentQuestion",currentQuestion);

			args = cmd.split(/ +/);

			console.log(cmd);
			console.log("user response =",userRes);
			console.log("quizz arg0",args[0]);
			console.log("quizz arg1",args[1]);
			console.log("quizz arg2",args[2]);
			console.log("quizz arg3",args[3]);
			console.log("quizz arg4",args[4]);
			
			//rpg game quizz [res/create/help]
			switch(args[3]){
				case "create":
					console.log('rpg game quizz create');
					console.log(currentQuestion);
					/*
					* Check if one question is currently set
					*/
					if(currentQuestion == -1){
						q = this.getRnd(message);
						currentQuestion = q.id;
						console.log('nouvelle question =',q.question);
						bot.sendMsg(q.question,message.channel);
					}else{
						bot.sendMsg("Une question est déjà en cours ("+nbTry+"essai(s) / "+nbTryMax+")",message.channel);
					}
				break;
				
				case "res":
					var startRes = 0;
					for (var i=0;i<4;i++){
						startRes+= args[i].length;
					}
					startRes+=3; // add whitespace count after each word count
					console.log(startRes);

					var userRes = message.text.substr(startRes).toLowerCase().trim();
			
					console.log("userRes =",userRes);

					nbTry++;
					if(nbTry == nbTryMax){
						nbTry = 0;
						bot.sendMsg("Trop de tentative ratée, la réponse etait : "+ this.getRes(currentQuestion)[0], message.channel);
						currentQuestion = -1;
						return;
					}

					if(currentQuestion == -1){
						bot.sendMsg("Il n'y a pas de question en cours",message.channel);
					}else{
						if(this.getRes(currentQuestion).indexOf(userRes) >= 0){
							bot.sendMsg("GGWP bonne réponse ! "+bot.getUserName(message), message.channel);
							currentQuestion	= -1;
							nbTry=0;
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
		getRes:function(questionId){
			return this.getQuizz()[questionId-1].response;
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
};
