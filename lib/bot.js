var db = require('./db'),
	fs = require('fs');


var games = {};
	games.list = [];
/**
* send Gold for current user
* @params : 
*         req => request
*         res => response
*/
function getGold (req,res){
	console.log("get gold");

	db.getGoldByUserName(getUser(req),function(gold){
		res.status(200).json({"text": "vous avez : "+ gold + " gold"})
	});
}
module.exports.getGold = getGold;

/**
* motd like
*
* @params : 
*         req => request
*         res => response
*/ 
function getRpg(req,res){

	var botPayload = {
		text : 'Hello, ' + getUser(req) + ', help available with "rpg help"'
	};
	res.status(200).json(botPayload);
}
module.exports.getRpg = getRpg;

/***
* Get the username of the request
* @params : 
*         req => request
*/
function getUser (req){
	return req.body.user_name;
}
module.exports.getUser = getUser;

/**
* Get the channel id of the request
* @params : 
*         req => request
*/
function getChannelId (req){
	return req.body.channel_id;
}
module.exports.getChannelId = getChannelId;

/**
* Get the channel name of the request
* @params : 
*         req => request
*/
function getChannelName (req){
	return req.body.channel_name;
}
module.exports.getChannelName = getChannelName;

/**
* Get the team id of request
* @params : 
*         req => request
*/
function getTeamId (req){
	return req.body.team_id;
}
module.exports.getTeamId = getTeamId;

/**
* Get Help messages
* @params : 
*         req => request
*         res => response
*/
function getHelp (req,res){

	var msg = [
		"RpgBot est un bot de role play avec système economique",
		"Liste des commandes :",
		" - rpg help  : Affiche ce message d'aide",
		" - rpg gold  : Consulte votre compte personnel",
		" - rpg top   : Liste les 10 joueurs les plus riches",
		" - rpg top <Nom_de_classe> : Liste les 10 joueurs les plus riches de la classe",
		" - rpg game list : Liste les jeux disponible",
		" - rpg class : Liste les classes disponible (LOL)",
		" - rpg class <Nom_de_classe> : Changement de classe (coute des golds)"
	].join('\n');

	res.status(200).json({"text":msg});
}
module.exports.getHelp = getHelp;

/**
* Get the top of player, all class mixed
* @params : 
*         req => request
*         res => response
*/
function getTop(req,res){

	db.getTopUserByGold(function(list){
		var text = "Le top "+ list.length +" des personnes les plus riches sont : \n";

		for(var i = 0; i< list.length;i++){
			text += " - ["+list[i].class_name+"] "+list[i].user_name;
			text +=" ( "+list[i].gold+" Gold ) \n";
		}

		res.status(200).json({"text":text,"mrkdwn": true});
	});
}
module.exports.getTop = getTop;

function getClasses(req,res){
	var msg ="Liste des classes : \n";
	db.getClass(function(list){
		console.log(list);
		
		if(list){
			for (var i = 0; i < list.length; i++) {
				msg += list[i].class_name+"\n";
			};
		}else{
			msg = "no class";			
		}

		res.status(200).json({"text": msg});
	})
}
module.exports.getClasses= getClasses;

/**
* Get the top of player by className
* @params : 
*         req => request
*         res => response
*/
function getTopByClass(req,res,className){

	db.getTopUserByClass(className,function(list){
		var text = "Le top "+ list.length +" des "+className+" les plus riches sont : \n";

		for(var i = 0; i< list.length;i++){
			text += " - "+list[i].user_name + " ( "+list[i].gold+" Gold ) \n";
		}

		res.status(200).json({"text":text});
	});
}
module.exports.getTopByClass = getTopByClass;

/**
* Set own class to current player
* @params :
*         req => request
*         res => response
*         class_name => new class of the player
*         (optional) cost => cost of the switch
*/
function setClass(req,res,class_name,cost){
	var msg = "";
	cost = cost || 0;
	db.subGold(getUser(req),cost,function(data){
		console.log(data);

		if(data){
			db.setClassForUser(getUser(req),class_name,function(data){
				if(data){
					msg += getUser(req) + " à changer de class pour ["+ class_name+"]";
				}else{
					msg = "Impossible de changer de classe";
				}
				res.status(200).json({"text":msg});
			});
		}
	});

}
module.exports.setClass = setClass;

/**
* Add class to classes only if current user isAdmin
* @params :
*       req => request
*       res => response
*		class_name => name of the new class
*		description=> description of the new class
*/
function addClass(req,res,class_name,description){
	var msg = "";
	db.isAdmin(getUser(req),function(isAdmin){

		if(isAdmin){
			db.addClass(class_name,description,function(result,err){
				console.log('class added !');
				console.log(result);

				if(err){
					if(err.code === "ER_DUP_ENTRY"){
						res.status(200).json({"text":"Class "+class_name+" already exist"});
					}
				}else{
					res.status(200).json({"text":"Class "+class_name+" successfully added"});
				}
			});

		}else{
			res.status(200).json({"text":"You don't have permissions to do that"});
		}
	});
}
module.exports.addClass = addClass;

/**
* Load each game in the game folder
*/
function loadGames(){
	fs.readdir("./games", function(err,files){

		if(typeof files !== "undefined"){
			for(var i=0;i<files.length;i++){
				// ignore file starting with _ char (disable module)
				if(files[i][0] != "_"){ 

					require("../games/"+files[i])(null,null,games);
					console.log("game "+files[i] +" loaded");

				}else{
					console.log("game "+files[i] +" NOT loaded");
				}
			}
		}else{
			console.log('no game loaded');
		}
	});

}
module.exports.loadGames = loadGames;

/**
* Get all games available
* disable game by putting "_" before his name or remove it from the games folder
* @params :
*       req => request
*       res => response
*/
function getAvailGames(req,res){
	var gameList="Actuellement, les jeux suivant sont disponible : \n";
	for (var i = 0; i < games.list.length; i++) {
		gameList += games.list[i].gameName+" [rpg game "+games.list[i].name+"] \n";
	}

	res.status(200).json({"text":gameList})
}
module.exports.getAvailGames = getAvailGames;

/*
* route => rpg game [name]
*/
function playGame(req,res,cmd){
	
	//game name (file)
	var gn = cmd.split(' ')[1];
	games[gn].router(req,res,games,cmd);

	console.log("game name ="+gn);
	console.log("games",games);


	if(gn){
		try{
			var game = require("../games/"+gn)(req,res,games,cmd);
		}catch(e){
			console.log("catch statement")
			console.error(e);
			getRpg(req,res);
		}	
	}else{
		getRpg(req,res);
	}
}
module.exports.playGame = playGame;