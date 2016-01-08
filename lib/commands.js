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
		for(row in data){
			console.log(data[row]);
			if(data[row].active > 0){
				console.log("Command active : ", data[row])
				commandsList[data[row].file_name].router(message);
			}
		}
	});
};

module.exports.getFullCommands = function(callback){
	//TODO FIX.
	db.getCommands(function(cmds){
		var toComplete = cmds.length; 
		for(cmd in cmds){
			(function(c){

				db.getTriggersForCommand(cmds[c].id, function(data){
					toComplete--;
					cmds[c].triggers = []
					
					for(i in data){
						cmds[c].triggers.push(data[i].name);
					}

					console.log("cmds[c].triggers : ", cmds[c].triggers);

					if(toComplete === 0){
						callback(cmds);
					}
				});

			})(cmd);
		}
	});
}

module.exports.toggleStatus = function (id, callback) {
	db.toggleCommandStatus(id, function(isOk){
		console.log("update done, status :", isOk);
		callback();
	});
}
module.exports.changeFileName = function (id, newFileName, callback) {
	db.changeCommandFileName(id, newFileName, function(isOk){
		console.log("update done, status :", isOk);
		callback();
	});
}
module.exports.changeName = function (id, newName, callback) {
	db.changeCommandName(id, newName, function(isOk){
		console.log("update done, status :", isOk);
		callback();
	});
}