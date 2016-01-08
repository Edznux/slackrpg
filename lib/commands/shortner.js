var https = require("https");

var db = require("../db.js");
var bot = require('../bot');
var slack = bot.getSlack();


function router(message){

	args = message.text.split(/ +/);

	db.getTriggersForCommandName("shortner", function(triggers){

		var triggers_list = [];

		for (var i = 0; i < triggers.length; i++) {
			triggers_list.push(triggers[i].name);
		}

		// add regexp on every triggers listed on the database
		var regexp = "^(" + triggers_list.join('|')+")";
		
		if( (new RegExp(regexp, "i").test(message.text)) ){

			switch(args[1]){
				case "help":
					bot.sendMsg(getHelp(), message);
				break;
				default:
					// check if link are pre formated by slack like : <http://edznux.fr|edznux.fr>
					var hostname;
					if( args[1].indexOf("|") >= 0 ){
						hostname = args[1].replace(/<|>/g,"").split('|')[1]; 
					}else{
						hostname = args[1];
					}

					shortUrl(hostname,function(err,data){
						if(err){
							console.log("error in shortner call", err);
							bot.sendMsg("Impossible de raccourcir ce lien !");
							return;
						}
						bot.sendMsg(data.id, message);
						console.log(data);
					});

				break;
			}
		}
	});

}
module.exports.router = router;
function getHelp(){
	return ["Url shortner : ",
			"Usage : shortner <url>"
			].join('\n');
}
module.exports.getHelp = getHelp;

function shortUrl(name,callback){
	var err = null;
	var option = {
			host: 'www.googleapis.com',
			port: '443',
			path: '/urlshortener/v1/url?key='+process.env.GOOGLE_KEY,
			method: 'POST',
			headers:{'Content-Type': 'application/json'}
		};

	var post_req = https.request(option, function(res){

		var data = "";

		res.on('data', function(chunk) {
			data += chunk;
		});


		res.on('end', function() {
			try{
				data = JSON.parse(data);
			}catch(e){
				err = e;
				console.log(e);
			}
			callback(err,data);
		});

	});

  	post_req.write('{"longUrl":"'+name+'"}');
  	post_req.end();
}
