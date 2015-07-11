var bot = require('./bot');
var https = require('https');
var slack = bot.getSlack();

function twitch(message){
	console.log("ok twitch");
	full = message.text;
	args = full.split(/ +/);

	console.log("full cmd = ",full);
	console.log("main arg0",args[0]);
	console.log("main arg1",args[1]);
	console.log("main arg2",args[2]);

	switch(args[1]){
		case "viewers":
			if(args[2]){
				getViewersByChannel(message,args[2]);
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
			getChannel(message,args[1]);
		break;
	}
}
module.exports = twitch;

function getChannel(message,channel_name){
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
					post.attachments.push(attach);

					channel = slack.getChannelGroupOrDMByID(message.channel);
					channel.postMessage(post);
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

function getViewersByChannel(message,channel_name){

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