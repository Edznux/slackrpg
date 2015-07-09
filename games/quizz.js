var bot = require("../lib/bot");
var gameName = "Quizz",
	name = "quizz",
	file = "quizz.js",

	currentQuestion = -1,
	nbTry = 0,
	nbTryMax = 10;

module.exports = function(req,res,games,cmd){
	
	games.quizz = function(){};

	if(!req && !res){
		console.log('req and res == null => loadGame function called');
		games.list.push({"gameName":gameName,"name":name,"file":file});
	}

	games.quizz = {
		router:function(req,res){
			var cmd = req.body.text.substr(4);
			console.log("nbTry =",nbTry,"nbTryMax",nbTryMax,"currentQuestion",currentQuestion);

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
					console.log(currentQuestion);
					if(currentQuestion == -1){
						q = this.getRnd(req,res);
						currentQuestion = q.id;
						console.log('Nouvelle question =',q.question);
						res.status(200).json({'text':q.question});
					}else{
						res.status(200).json({"text":"Une question est déjà en cours ("+nbTry+"essai(s) / "+nbTryMax+")"});
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
						res.status(200).json({"text":"Il n'y a pas de question en cours"});
					}else{
						if(this.getRes(currentQuestion).indexOf(userRes) >= 0){
							res.status(200).json({text:"GGWP bonne réponse !"+bot.getUser(req)});
						}else{
							res.status(200).json({text:"Mauvaise réponse."+bot.getUser(req)});
						}
					}
				break;

				case "help":
					this.getHelp(req,res);
				break;
				
				case "rules":
					this.getRules(req,res);
				break;

				default:
					this.getHelp(req,res);
					console.log("default quizz route");
				break;
			}
		},
		getQuizz: function(req,res){
			return [
				{"id":1,"question":"Quel est la réponse à La grande question sur la vie, l'univers et le reste ?", "response":["42"]},
				{"id":2,"question":"Qui est l'auteur de ce bot ?", "response":["édouard","edouard"]},
				{"id":3,"question":"Quel est la valeur max d'un integer (32 bit) ?", "response":['4294967295','4 294 967 295']},

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
					"Règles du jeu",
					"Une fois le quizz lancé avec [rpg game quizz create],",
					"les participants répondent dans le chat sous la forme [rpg game quizz res <réponse à la question>].",
					"Le premier partipant ayant la bonne réponse remporte la partie.",
				].join('\n');
			res.status(200).json({"text":rules});
		},
		getHelp : function(req,res){
			var help = [
					"Bienvenue dans " + gameName,
					"rpg game "+ name + " create : Nouvelle question",
					"rpg game "+ name + " res : Répondre à la question en cours",
				].join('\n'); 
			res.status(200).json({"text":help});
		}
	};
	return games;
};