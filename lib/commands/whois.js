var whois = require('whois');
var net = require('net');

var db = require("../db.js");
var bot = require('../bot');
var slack = bot.getSlack();

function router(message){

	args = message.text.split(/ +/);

	db.getTriggersForCommandName("whois", function(triggers){

		var triggers_list = [];

		for (var i = 0; i < triggers.length; i++) {
			triggers_list.push(triggers[i].name);
		}

		// add regexp on every triggers listed on the database
		var regexp = "^(" + triggers_list.join('|')+")";
		
		if( (new RegExp(regexp, "i").test(message.text)) ){

			switch(args[1]){
				case "help":
					bot.sendMsg(getHelp(),message);
				break;
				default:
					// check if link are pre formated by slack like : <http://edznux.fr|edznux.fr>
					var hostname;
					if( args[1].indexOf("|") >= 0 ){
						hostname = args[1].replace(/<|>/g,"").split('|')[1]; 
					}else{
						hostname = args[1];
					}

					getWhois(hostname,function(err,data){
						if(err){
							bot.sendMsg("Erreur lors du whois sur "+ args[1], message);
						}else{
							bot.sendMsg("```"+data+"```", message);
						}
					});
				break;
			}
		}
	});

}
module.exports.router = router;

function getWhois(name,callback){
	whois.lookup(name, function(err, data) {
		console.log(data);
		callback(err,data);
	});
}

function getHelp(){
	return [
			"Whois commands : ",
			"Usage : whois <example.com>"
			].join("\n");
}

// just for fun, deprecated
function getWhoisByName(name,callback){
	var client = new net.Socket();

	//43 port whois
	//whois.nic.fr => server of .fr

	client.connect(43, 'whois.nic.fr', function() {
		console.log('Connected');
		client.write(name+'\r\n');
	});

	client.on('data', function(data) {
		console.log('Received: ' + data);
		client.destroy(); // destroy connect
		var err = null;
		callback(err, data);
	});

	client.on('close', function() {
		console.log('Connection closed');
	});
}