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
		var regexp = "^" + triggers_list.join('|');
		if( (new RegExp(regexp, "i").test(message.text)) ){

			trigger_used = message.text.match(regexp);

			console.log(trigger_used);

			args = message.text.split(new RegExp(trigger_used, "i"));

			console.log(args);

			switch(args[1]){
				case "":
					bot.sendMsg("Vous devez fournir une video a rechercher", message);
				break;
				default:
					getVideoIdByKeyword(args[1],function(err,id){
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
	https.get("https://www.googleapis.com/youtube/v3/search?part=id&q="+keyword+"&key="+process.env.GOOGLE_KEY, function(res){
		console.log("statusCode: ", res.statusCode);
		console.log("headers: ", res.headers);

		var data = "";
		res.on('data', function(d) {
			data+=d;
		});
		
		res.on('end',function(){
			try{
				data = JSON.parse(data);
				if(data && data.items){
					callback(null,data.items[0].id.videoId);
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