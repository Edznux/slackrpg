var https = require('https');
var bot = require('../bot');
var slack = bot.getSlack();
var db = require('../db.js');

function router(message){
	args = message.text.split(/ +/);

	db.getTriggersForCommandName("youtube", function(triggers){

		var triggers_list = [];

		for (var i = 0; i < triggers.length; i++) {
			triggers_list.push(triggers[i].name);
		}

		// add regexp on every triggers listed on the database
		var regexp = "^(" + triggers_list.join('|')+")";
		console.log("full regexp",regexp);
		if( (new RegExp(regexp, "i").test(message.text)) ){

			trigger_used = message.text.match(regexp);

			console.log("trigger_used =", trigger_used);
			console.log("trigger_used[0] =", trigger_used[0]);

			args = message.text.split(new RegExp(trigger_used[0], "i"));

			console.log("args =", args);
			console.log("args[0] =", args[0]);
			console.log("args[1] =", args[1].trim());

			switch(args[1]){
				case "":
					bot.sendMsg("Vous devez fournir une video a rechercher", message);
				break;
				default:
					getVideoIdByKeyword(args[1].trim(),function(err,id){
						if(err){
							bot.sendMsg(id, message);
							return;
						}
						bot.sendMsg("https://youtube.com/watch?v="+id, message);
					});
				break;
			}
		}
	});
}
module.exports.router = router;

function getVideoIdByKeyword(keyword, callback){
	var url = "https://www.googleapis.com/youtube/v3/search?part=id&q="+encodeURIComponent(keyword)+"&type=video&key="+process.env.GOOGLE_KEY;
	console.log(url);
	https.get(url, function(res){
		console.log("statusCode: ", res.statusCode);
		console.log("headers: ", res.headers);

		var data = "";
		res.on('data', function(d) {
			data+=d;
		});
		
		res.on('end',function(){
			try{
				data = JSON.parse(data);
				var i = 0; // counter for testing items type (ex. channel id, videoId) 
				if(data && data.items){
					callback(null,data.items[i].id.videoId);
				}
			}catch(e){
				console.log(e);
				callback(e,"Impossible de recuperer une video avec la recherche : '"+keyword+"'");
			}
		});

	}).on('error', function(e) {
		console.error(e);
	});
}