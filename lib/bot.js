var db = require('./db');

/**
* send Gold for current user
* @params : 
*         req => request
*         res => response
*/
function getGold (req,res){
	console.log("get gold");

	db.getGoldByUserName(getUser(req),function(gold){
		res.status(200).json({text: "vous avez : "+ gold + " gold"})
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
* Get the req.body with User name, id
* @params : 
*         req => request
*/
function getUser (req){
	return req.body.user_name;
}
module.exports.getUser = getUser;

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
		" - rpg top   : Liste les 5 joueurs les plus riches",
		" - rpg class : Liste les classes disponible (LOL)",
		" - rpg class <Nom_de_classe> : Changement de classe (coute des golds)"
	].join('\n');

	res.status(200).json({text:msg});
}
module.exports.getHelp = getHelp;

/**
*
*/
function getTop(req,res){
	console.log("get Top");
	db.getTopUserByGold(function(list){
		console.log("get Top User By Gold callback");
		console.log(list);
		var text = "Le top "+ list.length +" des personnes les plus riches sont : \n";
		for(var i = 0; i< list.length;i++){
			text += " - "+list[i].user_name + " ("+list[i].gold+" Gold ) \n";
		}
		res.status(200).json({text:text});
	});
}
module.exports.getTop = getTop;