var bot = require('../bot');
var db = require("../db.js");
var http = require('http');
var slack = bot.getSlack();

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function router(message){

	args = message.text.split(/ +/);

	db.getTriggersForCommandName("xkcd", function(triggers){

		var triggers_list = [];

		for (var i = 0; i < triggers.length; i++) {
			triggers_list.push(triggers[i].name);
		}

		// add regexp on every triggers listed on the database
		var regexp = "^(" + triggers_list.join('|')+")";
		
		if( (new RegExp(regexp, "i").test(message.text)) ){

			switch(true){ // need to do this for handle number range
				case args[1] == "?":
					console.log("random comic generation :");
					getRandomComicId(function(err,id){
						if(err){
							bot.sendMsg("Impossible de recuperer un comic aleatoire", message);
							return;
						}
												
						console.log("random id :", id);

						getComicById(id,function(err,data){
							if(err){
								bot.sendMsg("Impossible de recuperer le comic generer aleatoirement ("+ id + ")", message);
								return;
							}
							postComic(data,message);
						});
					});
				break;

				case isNumber(args[1]):
					console.log(args[1]);
					getComicById(args[1], function(err, comic){
						if(err){
							bot.sendMsg("Impossible de recuperer le comic "+ args[1], message);
							return;
						}
						postComic(comic, message);
					});
				break;

				default:
					getLastComic(function(err, comic){
						if(err){
							bot.sendMsg("Impossible de recuperer le dernier comic ", message);
							return;
						}
						postComic(comic, message);
					});

				break;
			}
		}
	});

}
module.exports.router = router;

function getLastComic(callback){
	http.get("http://xkcd.com/info.0.json",function(res){
		var data="";
		var err = null;

		res.on('data', function(d) {
			data+=d;
		});

		res.on('end', function(){
			try{
				data = JSON.parse(data);
			}catch(e){
				console.log('Erreur dans getLastComic : ', e);
				console.log(data);
				callback("Erreur dans le json.parse getLastComic", null);
			}
			callback(err, data);
		});
	});
}

function getComicById(id, callback){
	console.log("Getting comic id :", id);
	http.get("http://xkcd.com/"+id+"/info.0.json",function(res){
		var data="";
		var err = null;
		console.log(res.statusCode);

		if(res.statusCode == 404){
			err = "404";
			callback(err,null);
		}
		res.on('data', function(d) {
			data+=d;
		});

		res.on('end', function(){
			try{
				data = JSON.parse(data);
			}catch(e){
				console.log('Erreur dans getComicById : ', e);
				console.log(data);
				callback("Erreur dans le json.parse getComicById", null);
			}
			callback(null, data);
		});
	});
}

function getRandomComicId(callback){
	getLastComic(function(err, data){
		if(err){
			callback(err,null);
		}
		var _lastNum = data.num;
		console.log("last num =",_lastNum);
		var id = Math.floor(Math.random()*_lastNum)+1;
		callback(null, id);
	});
}

function postComic(comic, message){
	var post = {};
		post.attachments = [];
	var	attach = {};


	attach.fallback = "XKCD #"+comic.num;
	attach.unfurl_links = true;
	attach.color="#FF5500";
	attach.author_name = "XKCD :";
	attach.title = comic.safe_title;
	attach.title_link = "http://xkcd.com/"+comic.num;
	attach.text = comic.alt;
	attach.thumb_url = comic.img;
	post.attachments.push(attach);

	channel = slack.getChannelGroupOrDMByID(message.channel);
	channel.postMessage(post);
}