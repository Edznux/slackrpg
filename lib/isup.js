var bot = require('./bot');
var http = require('http');
var slack = bot.getSlack();

function isup(message){
	console.log("ok isup");
	args = message.text.split(/ +/);

	switch(args[1]){
		default:
			apiCall(message);
		break;
	}
}
module.exports = isup;

function apiCall(message){
	var site_name = message.text.split(/ +/)[1];
	// check if domain name (not ip);
	if(site_name.split(/<(.*?)>/)[1]){
		site_name = site_name
					.split(/<(.*?)>/)[1]
					.split('|')[1];
	}
		

	console.log(site_name);
	
	console.log("http://isitup.org/"+site_name+".json");

	var option = {
		host: 'isitup.org',
		path: '/'+site_name+'.json',
		json: true,
		headers: {
			'user-agent': 'https://github.com/edznux/slackrpg'
		}
	};

	http.get(option, function(res){
		console.log(res.statusCode);
		var data="";
		
		res.on('data',function(d){
			data+=d;
		});

		res.on('end',function(){
			data = JSON.parse(data);
			if(res.statusCode == 200){
				console.log(data.status_code);
				switch(data.status_code){
					case 1:
						bot.sendMsg(data.domain + " is up! (" + data.response_ip + ")", message);
					break;
					case 2:
						bot.sendMsg(data.domain + " appears down ! (" + data.response_ip + ")", message);
					break;
					case 3:
						bot.sendMsg(data.domain + " Invalid domain name!", message);
					break;
					default:
						throw "Error in switch case (default)";
					break;
				}
			}
		});
	});
}