var Slack = require('slack-client');
var config = require('./config');
var rpgbot = require('./rpgbot');
var bot = require('./lib/bot');
var db = require('./lib/db');
var router = require('./lib/router.js');
var twitch = require('./lib/twitch.js');
var isup = require('./lib/isup.js');
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
	/*
	* Register all user in db
	*/

	for(key in channels){
		channel = slack.getChannelByName(channels[key]);
		for(user in channel.members){
			user_id = channel.members[user];
			bot.addUser(user_id, slack.team.id, 1, 1000, 0);
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

		if(!user){
			console.log("not an user");
			return;
		}

		if(message.text.split(" ")[0] == "rpg"){
			router(message);
		}
		if(message.text.split(" ")[0] == "twitch"){
			twitch(message);
		}
		if(message.text.split(" ")[0] == "isup"){
			isup(message);
		}
	}
});

slack.on('presenceChange',function(user){
	if(user.name !== "slackrpg"){
		if(user.presence == "away"){
			slack.getChannelByName("general").send("Re "+user.name+" !");
		}
	}else{
		console.log('bot reconnected');
	}
	console.log("MANUAL PRESENCE CHANGE");
});

slack.on('error', function(error) {

	console.error('Error: %s', error);
});

slack.login();
