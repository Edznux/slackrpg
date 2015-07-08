var db = require('./lib/db');
db.connect();

module.exports = function (req, res, next) {

	var userName = getUser(req);
	console.log('userName : ',userName);
	
	if(!userName){
		console.log('no user name');
		res.status(200).json({text:"No nickname"});
	}

	db.getUserByName(userName,function(exist){
		console.log('User By Name');

		if(!exist){
			db.createUser(userName,"citizen",0,function(result){
				console.log('Create user :');
				console.log(result);
			});
		}

		routes(req,res);
	})
}

function routes(req,res){

	if (getUser(req) === 'slackbot') {
		return res.status(200).end();
	}

	switch(req.body.text.substr(4)){

		// print gold by user
		case "gold":
			getGold(req,res);
		break;

		//help message
		case "help":
			getHelp(req,res);
		break;

		//default message (motd like)
		default:
			getRpg(req,res);
		break;
	}
}

/**
* send Gold for current user
* @params : 
*         req => request
*         res => response
*/
function getGold(req,res){
	console.log("get gold");

	db.getGoldByUserName(getUser(req),function(gold){
		res.status(200).json({text: "vous avez : "+ gold + " gold"})
	});
}

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

/***
* Get the req.body with User name, id
* @params : 
*         req => request
*/
function getUser(req){
	return req.body.user_name;
}

/**
* Get Help messages
* @params : 
*         req => request
*         res => response
*/
function getHelp(req,res){

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