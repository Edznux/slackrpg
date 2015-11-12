var bot = require('../bot');
var db = require("../db.js");
var https = require('https');
var slack = bot.getSlack();

var _lastValue = {};

getBtcInfo();
setInterval(function(){
	getBtcInfo();
}, 900000);

function router(message){

	args = message.text.split(/ +/);

	db.getTriggersForCommandName("bitcoin", function(triggers){

		var triggers_list = [];

		for (var i = 0; i < triggers.length; i++) {
			triggers_list.push(triggers[i].name);
		}

		// add regexp on every triggers listed on the database
		var regexp = "^(" + triggers_list.join('|')+")";
		
		if( (new RegExp(regexp, "i").test(message.text)) ){
			switch(args[1]){
				case "$":
					symbol = "USD";
				break;
				case "£":
					symbol = "GBP";
				break;
				case "€":
					symbol = "EUR";
				break;
				default:
					symbol = "USD"; // default symbol
				break;
			}
			bot.sendMsg("Le bitcoin vaux actuellement : "+ _lastValue[symbol].last+" "+_lastValue[symbol].symbol+" (updated at : " + _lastValue.updatedAt+ " )", message);
		}
	});

}
module.exports.router = router;

function getBtcInfo(){
	https.get("https://blockchain.info/ticker",function(res){
		var data="";

		res.on('data', function(d) {
			data+=d;
		});

		res.on('end', function(){
			console.log(Date(), data);
			var update = Date();
			try{
				_lastValue = JSON.parse(data);
				_lastValue.updatedAt = update;
			}catch(e){
				console.log("Error in getBtcInfo  JSON.parse(); data :", data);
			}
		});
	});
}