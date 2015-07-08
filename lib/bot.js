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

function loadGames(){
	fs.readdir("./games", function(err,files){

		if(typeof files !== "undefined"){
			for(var i=0;i<files.length;i++){
				// ignore file starting with _ char (disable module)
				if(files[i][0] != "_"){ 

					require("../games/"+files[i])(null,null,games);
					// Print game name to clients					
					//add custom routing
					// console.log(games.list[i].name);

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
*/
function getAvailGames(req,res,cmd){
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