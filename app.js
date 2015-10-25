require('dotenv').load();
var Slack = require('slack-client');
var rpgbot = require('./rpgbot');
var bot = require('./lib/bot');
var db = require('./lib/db');
var router = require('./lib/router.js');
var twitch = require('./lib/twitch.js');
var isup = require('./lib/isup.js');

var app = require('./www/main.js');

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
		console.log(user);
		
		if(!user){
			console.log("not an user");
			return;
		}

		//update timestamps
		bot.touchUser(user.id,true);

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
	if(process.env.WELCOME_BACK_MESSAGE == "active"){
		if(user.name !== "slackrpg"){
			if(user.presence == "away"){
				bot.getUserFromDBById(user.id,function(result){
					console.log("getUserFromDBById: ",result[0].user_id, "updated_at :",result[0].updated_at);

					//43200000ms == 12h
					//86400000ms == 24h
					if(Date.now()-86400000 > result[0].last_message_at){
					console.log("message il y'a moins de 24 h");
					// 1800000ms == 30 min
						if(Date.now()-1800000 >result[0].updated_at){
							slack.getChannelByName("bots").send("Re "+user.name+" !");
							bot.touchUser(user.id,false);
						}
					}
				});
			}
		}else{
			console.log('bot reconnected');
		}
		console.log("MANUAL PRESENCE CHANGE");
	}
});

slack.on('error', function(error) {

	console.error('Error: %s', error);
});

slack.login();
