#SlackRPG#


SlackRPG is a Slack bot with an financial system, games etc...

```
    git clone https://github.com/edznux/slackrpg.git
    cd slackrpg
    npm install
```
Next, create a new user and a new database (if you use phpmyadmin, you can add one in the "privilege" tab).
I recommand to create an user "rpgbot" with the same database name and a generated password.

Then, create a ".env" file which contains : 

```
DB_HOST=localhost
DB_USER=rpgbot
DB_PASS=your_database_password
BOT_TOKEN=xxxx-yourbottokenhereazbeceaerzaze-azeaez
```

Finally, launch the bot:

```
node app.js
```


##Add Game##
create one file in /games folder

    var bot = require("../lib/bot");
    var gameName = "My awesome game",
        name = "mag",
        file = "mag.js";
    
    module.exports = function(req,res,games,cmd){
        
        games.mag = function(){};
        
        for(var i=0;i<games.list.length;i++){
            if(games.list[i].name !== name){
                games.list.push({"gameName":gameName,"name":name,"file":file});
            }
        }
    
        games.mag = {
            /**
            * custom route for your games
            */
            router : function(req,res){
            }
        }
    }

All game will be loaded *exept* if file name start with "_"

    like "_rnd.js"
