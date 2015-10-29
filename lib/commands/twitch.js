var bot = require('../bot');
var db = require("../db.js");
var https = require('https');
var slack = bot.getSlack();

function router(message){

	args = message.text.split(/ +/);

	db.getTriggersForCommandName("twitch", function(triggers){

		var triggers_list = [];

		for (var i = 0; i < triggers.length; i++) {
			triggers_list.push(triggers[i].name);
		}

		// add regexp on every triggers listed on the database
		var regexp = "^(" + triggers_list.join('|')+")";
		
		if( (new RegExp(regexp, "i").test(message.text)) ){

			switch(args[1]){
				case "viewers":
					if(args[2]){
						getViewersByChannel(message);
					}else{
						bot.sendMsg("Vous devez specifier un nom de stream",message);
					}

				break;
				case "follow":

				break;
				case "help":
					getHelp(message);
				break;
				default:
					getChannel(message);
				break;
			}
		}
	});

}
module.exports.router = router;

function getChannel(message){

	var channel_name = message.text.split(' ')[1];
	/*
	* get stream by name
	*/
	https.get("https://api.twitch.tv/kraken/streams/"+channel_name, function(res) {
		var post = {};
			post.attachments = [];
		var	attach = {};
		var data="";

		res.on('data', function(d) {
			data+=d;
		});

		// at the end of the request
		res.on('end', function(){

			data = JSON.parse(data);
			if(res.statusCode == 200){
				console.log("Got data: ", data);
				if(data.stream){
					/*
					* Customize attachement
					*/
					attach.fallback = "Twitch of "+channel_name;
					attach.unfurl_links = true;
					attach.color="#6441A5";
					attach.author_name = "Twitch :";
					attach.title = channel_name;
					attach.title_link = data.stream.channel.url;
					
					attach.text = channel_name+" est en ligne, sur : "+data.stream.game+" avec "+ data.stream.viewers +" viewer(s)";
					attach.thumb_url = data.stream.channel.logo;
					post.attachments.push(attach);

					channel = slack.getChannelGroupOrDMByID(message.channel);
					channel.postMessage(post);
					// bot.sendMsg(channel_name+" est en ligne, sur : "+data.stream.game+" avec "+ data.stream.viewers +" viewer(s)",message);
				}else{
					bot.sendMsg(channel_name+" n'est pas en ligne",message);
				}
			}else{
				bot.sendMsg("Erreur lors de la récuperation du stream",message);
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

function getViewersByChannel(message){
	var channel_name = message.text.split(' ')[2];
	https.get("https://api.twitch.tv/kraken/streams/"+channel_name, function(res) {
		console.log("Got response: " + res.statusCode);
		var data="";
		res.on('data', function(d) {
			data+=d;
		});
		res.on('end', function(){
			data = JSON.parse(data);
			if(res.statusCode == 200){
				console.log("Got data: ", data);
				if(data.stream){
					bot.sendMsg(channel_name+" à "+data.stream.viewers+"viewer(s) sur "+ data.stream.game,message);
				}else{
					bot.sendMsg(channel_name+" n'est pas en ligne",message);
				}
			}else{
				bot.sendMsg("Erreur lors de la récuperation du stream",message);
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

function getHelp(message){
	var help = [
				"Aide pour la commande twitch",
				"twitch help : affiche ce message d'aide",
				"twitch viewers <channel> : affiche le nombre de viewers du <channel>",
				"twitch <channel> : affiche le status du <channel>",
			].join('\n');
	bot.sendMsg(help,message);
}