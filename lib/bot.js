var db = require('./db'),
	fs = require('fs'),
	Slack = require('slack-client');
	
var slack;

var games = {};
	games.list = [];

// Add a bot at https://my.slack.com/services/new/bot and copy the token here.
var token =process.env.BOT_TOKEN,
	autoReconnect = true,
	autoMark = true;

var slack = new Slack(token, autoReconnect, autoMark);

module.exports.getSlack = function(){
	return slack;
};

function sendMsg(msg,channelID){
	console.log("msg",msg,"channelId",channelID);
	var channel = slack.getChannelByID(channelID);
	channel.send(msg);
}
module.exports.sendMsg = sendMsg;

/**
* send Gold for current user
*/
function getGold (message){
	console.log("get gold");

	db.getGoldByUserName(getUserName(message),function(gold){
		sendMsg("vous avez : "+ gold + " gold",message.channel);
	});
}
module.exports.getGold = getGold;

/**
* motd like
*
*/
function getRpg(message){
	sendMsg("Bonjour, "+ getUserName(message) + ", l'aide est disponible avec 'rpg help'.", message.channel);
}
module.exports.getRpg = getRpg;

/**
* Get the user of the request
*/
function getUser(message){
	return slack.getUserByID(message.user);
}
module.exports.getUser = getUser;

/**
* Get the user of the request
*/
function getUserName(message){
	return getUser(message).name;
}
module.exports.getUserName = getUserName;

/**
* Get the channel id of the request
*/
function getChannelId (message){
	return message.channel;
}
module.exports.getChannelId = getChannelId;

/**
* Get the channel name of the request
*/
function getChannelName(message){
	return slack.getChannelByID(message.channel).name;
}
module.exports.getChannelName = getChannelName;

/**
* Get the team id of request
*/
function getTeamId (message){
	return message;
}
module.exports.getTeamId = getTeamId;

/**
* Get Help messages
* @params : 
*/
function getHelp (message){

	var msg = [
		"RpgBot est un bot de role-play avec système économique",
		"Liste des commandes :",
		" - rpg help  : Affiche ce message d'aide",
		" - rpg gold  : Consulte votre compte personnel",
		" - rpg gold give <utilisateur> <montant> : Donne à <utilisateur> <montant> de gold",
		" - rpg top   : Liste les 10 joueurs les plus riches",
		" - rpg top <Nom_de_classe> : Liste les 10 joueurs les plus riches de la classe",
		" - rpg game list : Liste les jeux disponibles",
		" - rpg class : Liste les classes disponibles",
		" - rpg class <Nom_de_classe> : Changement de classe (coûte 100 gold)"
	].join('\n');
	sendMsg(msg,message.channel);
}
module.exports.getHelp = getHelp;

/**
* Get Help messages for rpg top
*/
function getHelpTop (message){

	var msg = [
		"Liste des commandes pour rpg top:",
		" - rpg top help  : Affiche ce messages d'aide",
		" - rpg top : Affiche le top global",
		" - rpg top <classe>  : Affiche le top pour la <classe>",
	].join('\n');
	sendMsg(msg, message.channel);
}
module.exports.getHelpTop = getHelpTop;

/**
* Get Help messages for rpg top
*/
function getHelpClass (message){

	var msg = [
		"Liste des commandes pour rpg class:",
		" - rpg class help  : Affiche ce messages d'aide",
		" - rpg class : Affiche votre classe",
		" - rpg class list  : Affiche les classes disponible",
		" - rpg class set <classe> : Vous fait changer de classe pour la <classe> (coût : 100 gold)",
	].join('\n');

	sendMsg(msg, message.channel);
}
module.exports.getHelpClass = getHelpClass;


/**
* Get the top of player, all class mixed
*/
function getTop(message){
	db.getTopUserByGold(function(list){
		var msg = "Le top "+ list.length +" des personnes les plus riches est : \n";
		console.log("list =>",list);
		
		db.getClasses(function(classes){

			for(var i = 0; i < list.length;i++){
				class_id = list[i].class_id-1;

				msg += " - [" + classes[class_id].class_name +"] " + list[i].user_name;
				msg +=" ( "+list[i].gold+" Gold ) \n";
			}
			sendMsg(msg, message.channel);

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

function getClasses(message){
	var msg ="Liste des classes : \n";

	db.getClasses(function(list){
		console.log("liste = ",list);
		
		if(list){
			for (var i = 0; i < list.length; i++) {
				msg += list[i].class_name+"\n";
			}
		}else{
			msg = "no class";
		}
		sendMsg(msg, message.channel);
	});
}
module.exports.getClasses= getClasses;
/**
* 
*/
function getClassNameByUserName(message){
	db.getClassNameByUserName(getUserName(message),function(className){
		console.log(className);
		sendMsg(className,message.channel);
	});
}
module.exports.getClassNameByUserName = getClassNameByUserName;

/**
* Get the top of player by className
* @params : 
*/
function getTopByClass(message,className){
	console.log(className);
	db.getTopUserByClassName(className,function(list){
		var msg = "Le top "+ list.length +" des "+className+" les plus riches est : \n";


		for(var i = 0; i< list.length;i++){
			msg += " - "+list[i].user_name + " ( "+list[i].gold+" Gold ) \n";
		}
		sendMsg(msg,message.channel);
	});
}
module.exports.getTopByClass = getTopByClass;

/**
* Set own class to current player
* @params :
*         class_name => new class of the player
*         (optional) cost => cost of the switch
*/
function setClass(message,class_name,cost){
	var msg = "";
	cost = cost || 0;

	db.setClassForUser(getUserName(message),class_name,function(classUser){
		if(!classUser){
			msg = "Impossible de changer de classe";
			sendMsg(msg,message.channel);
		}else{
			db.subGold(getUserName(message),cost,function(isOk,err){
				console.log(err);
				if(isOk){
					console.log("isOk = ",isOk);
					msg += getUserName(message) + " a changer de class pour ["+ class_name+"]";
					console.log("msg = ",msg);
					
				}else{
					msg = "Impossible de changer de classe";
				}
				sendMsg(msg, message.channel);
			});
		}
	});
}
module.exports.setClass = setClass;

/**
* Add class to classes only if current user isAdmin
* @params :
*		class_name => name of the new class
*		description=> description of the new class
*/
function addClass(message,class_name,description){
	var msg = "";
	db.addClass(class_name,description,function(result,err){
		console.log('class added !');
		console.log(result);

		if(err){
			if(err.code === "ER_DUP_ENTRY"){
				sendMsg("La classe "+class_name+" existe déjà.",message.channel);
			}
		}else{
			sendMsg("La classe "+class_name+" a bien été ajoutée.",message.channel);
		}
	});
}
module.exports.addClass = addClass;

function isAdmin(message,callback){
	db.isAdmin(getUserName(message),function(isAdmin){
		if(isAdmin){
			callback(true);
		}else{
			sendMsg("Vous n'avez pas les permissions nécessaire pour faire cela.",message.channel);
			callback(false);
		}
	});
}
module.exports.isAdmin = isAdmin;

function giveGold(message,from,to,amount){
	if(amount < 0){
		sendMsg("Vous ne pouvez pas donner un nombre négatif de gold.",message.channel);
		return;
	}
	if(amount == 0){
		sendMsg("Vous ne pouvez pas donner 0 gold.",message.channel);
		return;
	}
	db.getGoldByUserName(getUserName(message),function(gold){
		if(amount < gold){
			db.addGold(to,amount,function(){
				db.subGold(from,amount,function(){
					sendMsg("Vous avez donné "+amount+" à "+to,message.channel);
				});
			});
		}else{
			sendMsg("Vous n'avez pas assez de gold ("+ amount+"/"+gold+")",message.channel);
		}
	});
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
					require("../games/"+files[i])(null,games);
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
function getAvailGames(message){
	var gameList="Actuellement, les jeux suivant sont disponibles : \n";
	for (var i = 0; i < games.list.length; i++) {
		gameList += games.list[i].gameName+" [rpg game "+games.list[i].name+"] \n";
	}
	sendMsg(gameList, message.channel);
}
module.exports.getAvailGames = getAvailGames;

/*
* route => rpg game [name]
*/
function playGame(message){
	
	//game name (file)
	var cmd = message.text;
	var gn = cmd.split(' ')[2];

	console.log("game name ="+gn);
	console.log("games",games);


	if(gn){
		try{
			var game = require("../games/"+gn)(message,games,cmd);
			games[gn].router(message);
		}catch(e){
			console.log("catch statement");
			console.error(e);
			getRpg(message);
		}
	}else{
		getRpg(message);
	}
}
module.exports.playGame = playGame;