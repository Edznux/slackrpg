var fs = require("fs");

var twitch = require('./commands/twitch.js');
var isup = require('./commands/isup.js');
var db = require("./db.js");
var commandsList = {};

// execute this loader once, at start.
init();
function init(){
	fs.readdir(__dirname+"/commands/", function(err,files){
		console.log(files);
		if(typeof files !== "undefined"){
			for(var i=0;i<files.length;i++){
				// ignore file starting with _ char (disabled commands)
				if(files[i][0] != "_"){
					commandsList[files[i]] = require("./commands/"+files[i]);
					console.log("commands "+files[i] +" loaded");

				}else{
					console.log("commands "+files[i] +" NOT loaded");
				}
			}
		}else{
			console.log('no command loaded');
		}
	});
}


module.exports.loader = function(message){

	console.log("commandList: ", commandsList);
	db.getCommands(function(data){
		console.log(data);
		for(row in data){
			console.log(data[row]);
			if(data[row].active > 0){
				commandsList[data[row].file_name].router(message);
			}
		}
	});
}