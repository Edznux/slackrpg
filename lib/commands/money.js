var bot = require('../bot');
var db = require("../db.js");
var http = require('http');
var fx = require('money');
fx.base = "EUR";
getCurrency();

var slack = bot.getSlack();

//list all currency and symbol
var currency = {"USD":"$", "GBP":"£","EUR":"€", "RUB":"руб"};
var currencyReversed = {"$":"USD", "£":"GBP","€":"EUR", "руб":"RUB"};


function router(message){


	db.getTriggersForCommandName("money", function(triggers){

		var triggers_list = [];

		for (var i = 0; i < triggers.length; i++) {
			triggers_list.push(triggers[i].name);
		}

		// add regexp on every triggers listed on the database
		var regexp = "^(" + triggers_list.join('|')+")";

		if( (new RegExp(regexp, "i").test(message.text)) ){

			trigger_used = message.text.match(regexp);
			console.log(trigger_used);

			args = message.text.split(new RegExp(trigger_used, "i"));
			console.log(args);
			// convert 10 from $ to €
			try{

				var amount = args[1].split(/ +/)[1];
				console.log("amount:",amount);
				var from = args[1].split(/ +/)[2];
				console.log("from:",from);
				var to = args[1].split(/ +/)[3];
				console.log("to:",to);

				var value = convertFromTo(from,to,amount);
				bot.sendMsg(value,message);

			}catch(e){
				bot.sendMsg("Mauvaise syntaxe", message);
			}
		}
	});

}
module.exports.router = router;

function convertFromTo(from,to,amount){
	console.log(from,to,amount);

	// add support for symbol ($ = USD);
	if(currencyReversed.hasOwnProperty(from)){
		from = currencyReversed[from];
	}
	if(currencyReversed.hasOwnProperty(to)){
		to = currencyReversed[to];
	}
	
	return fx.convert(amount, {from: from, to: to}).toFixed(2);
}

function getCurrency(){
	http.get("http://api.fixer.io/latest", function(res){
		var data="";

		res.on('data', function(d) {
			data+=d;
		});

		// at the end of the request
		res.on('end', function(){
			data = JSON.parse(data);
			if(data.rates){
				console.log("Rates successfully fetched");
				console.log(data.rates);
				fx.rates = data.rates;
			}
		});
	});
}