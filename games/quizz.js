var bot = require("../lib/bot");
var gameName = "Quizz",
	name = "quizz",
	file = "quizz.js";
var currentQuestion = 0;
module.exports = function(req,res,games,cmd){
	
	games.quizz = function(){};

	if(!req && !res){
		console.log('req and res == null => loadGame function called');
		games.list.push({"gameName":gameName,"name":name,"file":file});
	}

	games.quizz = {
		router:function(req,res){
			var cmd = req.body.text.substr(4);

			var arg1 = cmd.split(' ')[1];
			var arg2 = cmd.split(' ')[2];
			var arg3 = cmd.split(' ')[3];
			var arg4 = cmd.split(' ')[4];

			var userRes = req.body.text.substr(19).toLowerCase().trim();
			
			console.log(cmd);
			console.log("quizz arg1",arg1);
			console.log("quizz arg2",arg2);
			console.log("quizz arg3",arg3);
			console.log("quizz arg4",arg4);

			switch(arg2){
				case "create":
					console.log('rpg game quizz create');
					res.status(200).json({'text':this.getRnd(req,res).question})
				break;
				
				case "res":
					console.log(currentQuestion);
					console.log(this.getRes(currentQuestion));
					console.log(userRes);

					if(this.getRes(currentQuestion).indexOf(userRes) >= 0){
						res.status(200).json({text:"GGWP bonne reponse "+bot.getUser(req)});
					}else{
						res.status(200).json({text:"Mauvais réponse "+bot.getUser(req)});
					}
				break;

				case "help":
					this.getHelp(req,res);
				break;
				case "rules":
					this.getRules(req,res);
				break;

				default:
					console.log("default route");
				break;
			}
		},
		getQuizz: function(req,res){
			return [
				{"id":1,"question":"Quel est le chiffre blah ..?", "response":["42"]},
				{"id":2,"question":"Mon auteur est ?", "response":["edouard"]},
				{"id":1,"question":"Quel est la valeur max d'un integer (32 bit)?", "response":['4294967295','4 294 967 295']},

			];
		},
		getRnd : function(req,res){
			var nbq = this.getQuizz().length;
			var questionNo = Math.floor(Math.random()*nbq);
			currentQuestion = questionNo;
			return this.getQuizz()[questionNo];
		},
		getRes:function(questionNo){
			return this.getQuizz()[questionNo].response;
		},
		getRules: function(req,res){
			var rules = [
					"Règles du jeux",
					"Une fois le quizz lancer avec [rpg game quizz create]",
					"les participant reponde dans le chat sous la forme [rpg game quizz res <réponse a la question>]",
					"Le premier partipant ayant la bonne réponse remporte la partie",
				].join('\n');
			res.status(200).json({"text":rules});
		},
		getHelp : function(req,res){
			var help = [
					"Bienvenue dans " + gameName,
					"rpg game "+ name + " create : Nouvelle question",
					"rpg game "+ name + " res : Repondre a la question en cours",
				].join('\n'); 
			res.status(200).json({"text":help});
		}
	}
	return games;
}