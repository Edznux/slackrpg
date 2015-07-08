#SlackRPG#


SlackRPG is a Slack bot with an financial system, games etc...

    git clone https://github.com/edznux/slackrpg.git
    cd slackrpg
    npm install
    node app

##Add Game##
create one file in /games folder

    var bot = require("../lib/bot");
    var gameName = "My awesome game",
        name = "mag",
        file = "mag.js";
    
    module.exports = function(req,res,games,cmd){
        
        games.rnd = function(){};
        for(var i=0;i<games.list.length;i++){
            if(games.list[i].name !== name){
                games.list.push({"gameName":gameName,"name":name,"file":file});
            }
        }
    
        games.rnd = {
            /**
            * custom route for your games
            */
            router : function(req,res){
            }
        }
    }

All game will be loaded *exept* if file name start with "_"

    like "_rnd.js"
