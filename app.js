var Slack = require('slack-client');
var config = require('./config');
var rpgbot = require('./rpgbot');
var bot = require('./lib/bot');
var db = require('./lib/db');
var router = require('./lib/router.js');
db.connect();

var slack = bot.getSlack();

slack.on('open', function() {
	//motd
	var channels = [],
		groups = [],
		unreads = slack.getUnreadCount(),
		key;

	for (key in slack.channels) {
		if (slack.channels[key].is_member) {
			channels.push('#' + slack.channels[key].name);
		}
	}

	for (key in slack.groups) {
		if (slack.groups[key].is_open && !slack.groups[key].is_archived) {
			groups.push(slack.groups[key].name);
		}
	}

	console.log('Welcome to Slack. You are @%s of %s', slack.self.name, slack.team.name);
	console.log('You are in: %s', channels.join(', '));
	console.log('As well as: %s', groups.join(', '));
	console.log('You have %s unread ' + (unreads === 1 ? 'message' : 'messages'), unreads);
	/*
	* load games
	*/
	bot.loadGames();

});

slack.on('message', function(message) {

	if (message.type === 'message') {
		var type = message.type,
		channel = slack.getChannelGroupOrDMByID(message.channel),
		user = slack.getUserByID(message.user),
		time = message.ts,
		text = message.text,
		response = '';

		var userName = "edznux";

		if(!userName){
			channel.send('no user name');
		}
		// console.log('Received: %s %s @%s %s "%s"', type, (channel.is_channel ? '#' : '') + channel.name, user.name, time, text);

		db.getUserByName(userName,function(exist){

			if(!exist){
				db.createUser(userName,slack.getChannelById(message.channel).name,bot.getTeamId(req),"citizen",1000,function(result){
					console.log('Create user :');
					console.log(result);
				});
			}

			if(message.text.split(" ")[0] == "rpg"){
				router(message);
			}else{
				console.log('not and rpg msg');
			}

		});
	}
});

slack.on('error', function(error) {

	console.error('Error: %s', error);
});

slack.login();
