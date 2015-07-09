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
		" - rpg gold give username <amount> : Donne a username <montant> gold",
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
* Get Help messages for rpg top
* @params : 
*         req => request
*         res => response
*/
function getHelpTop (req,res){

	var msg = [
		"Liste des commandes pour rpg top:",
		" - rpg top help  : Affiche ce messages d'aide",
		" - rpg top : Affiche le top global",
		" - rpg top <classe>  : Affiche le top pour la <classe>",
	].join('\n');

	res.status(200).json({"text":msg});
}
module.exports.getHelpTop = getHelpTop;

/**
* Get Help messages for rpg top
* @params : 
*         req => request
*         res => response
*/
function getHelpClass (req,res){

	var msg = [
		"Liste des commandes pour rpg class:",
		" - rpg class help  : Affiche ce messages d'aide",
		" - rpg class : Affiche votre classe",
		" - rpg class list  : Affiche les classes disponible",
		" - rpg class set <classe> : Vous fait changer de classe pour la <classe> (cout : 100 gold)",
	].join('\n');

	res.status(200).json({"text":msg});
}
module.exports.getHelpClass = getHelpClass;


/**
* Get the top of player, all class mixed
* @params : 
*         req => request
*         res => response
*/
function getTop(req,res){
	db.getTopUserByGold(function(list){
		var text = "Le top "+ list.length +" des personnes les plus riches sont : \n";
		console.log("list =>",list);
		
		db.getClasses(function(classes){

			for(var i = 0; i < list.length;i++){
				class_id = list[i].class_id-1;

				text += " - [" + classes[class_id].class_name +"] " + list[i].user_name;
				text +=" ( "+list[i].gold+" Gold ) \n";
			}
			
			res.status(200).json({"text":text,"mrkdwn": true});
		});
	});
}
module.exports.getTop = getTop;
/**
* Warper direct from db.
*/
function getClassesList(callback){
	db.getClasses(function(c){
		callback(c);
	});
}
module.exports.getClassesList = getClassesList;

function getClasses(req,res){
	var msg ="Liste des classes : \n";

	db.getClasses(function(list){
		console.log("liste = ",list);
		
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
* 
*/
function getClassNameByUserName(req,res){
	db.getClassNameByUserName(getUser(req),function(className){
		console.log(className);
		res.status(200).json({"text":className});
	});
}
module.exports.getClassNameByUserName = getClassNameByUserName;

/**
* Get the top of player by className
* @params : 
*         req => request
*         res => response
*/
function getTopByClass(req,res,className){
	console.log(className);
	db.getTopUserByClassName(className,function(list){
		var text = "Le top "+ list.length +" des "+className+" les plus riches sont : \n";
		console.log(text);

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

	db.setClassForUser(getUser(req),class_name,function(classUser){
		if(!classUser){
			msg = "Impossible de changer de classe";
			res.status(200).json({"text":msg});
		}else{
			db.subGold(getUser(req),cost,function(isOk,err){
				console.log(err);
				if(isOk){
					console.log("isOk = ",isOk);
					msg += getUser(req) + " à changer de class pour ["+ class_name+"]";
					console.log("msg = ",msg);
					
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
}
module.exports.addClass = addClass;
function isAdmin(req,res,callback){
	db.isAdmin(getUser(req),function(isAdmin){
		if(isAdmin){
			callback(true);
		}else{
			res.status(200).json({"text":"You don't have permissions to do that"});
			callback(false);
		}
	});
}
module.exports.isAdmin = isAdmin;

function giveGold(req,res,from,to,amount){
	if(amount < 0){
		res.status(200).json({"text":"Vous ne pouvez pas donnée un nombre negatif de gold"});
		return;
	}
	if(amount == 0){
		res.status(200).json({"text":"Vous ne pouvez pas donnée 0 gold"});
		return;
	}
	db.getGoldByUserName(getUser(req),function(gold){
		if(amount < gold){
			db.addGold(to,amount,function(){
				db.subGold(from,amount,function(){
					res.status(200).json({"text":"Vous avez donnée "+amount+" a "+to});
				})
			});
		}else{
			res.status(200).json({"text":"Vous n'avez pas assez de gold ("+ amount+"/"+gold+")"});		
		}
	})
}
module.exports.giveGold = giveGold;


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

	console.log("game name ="+gn);
	console.log("games",games);


	if(gn){
		try{
			var game = require("../games/"+gn)(req,res,games,cmd);
			games[gn].router(req,res,games,cmd);
		}catch(e){
			console.log("catch statement");
			console.error(e);
			getRpg(req,res);
		}
	}else{
		getRpg(req,res);
	}
}
module.exports.playGame = playGame;