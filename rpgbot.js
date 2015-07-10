/*var db = require('./lib/db');
var router = require('./lib/router');
var bot = require('./lib/bot');
db.connect();


module.exports = function (message,slack) {
	// bot.sendMsg("test",message.channel);

	var type = message.type,
	channel = slack.getChannelGroupOrDMByID(message.channel),
	user = slack.getUserByID(message.user),
	time = message.ts,
	text = message.text,
	response = '';

	console.log('Received: %s %s @%s %s "%s"', type, (channel.is_channel ? '#' : '') + channel.name, user.name, time, text);

	var userName = user.name;
	console.log(channel.name);
	// no loop x)
	if(userName != slack.self.name){
		bot.sendMsg("test message",channel.name);
	}
	if(!userName){
		channel.send('no user name');
	}

	db.getUserByName(userName,function(exist){

		if(!exist){
			db.createUser(userName,bot.getChannelId(req),bot.getTeamId(req),"citizen",1000,function(result){
				console.log('Create user :');
				console.log(result);
			});
		}

		router(message);
	});
};*/