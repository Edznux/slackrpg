var mysql		= require('mysql');

var connection = mysql.createConnection({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USER, //'rpgbot',
	password : process.env.DB_PASS, //'password',
	database : 'rpgbot'
});


handleDisconnect(connection);
function handleDisconnect(connection) {
  connection.on("error", function (err) {
    if (!err.fatal) {
      return;
    }
 
    if (err.code !== "PROTOCOL_CONNECTION_LOST") {
      throw err;
    }
    connection = mysql.createConnection(connection.config);
    replaceClientOnDisconnect(client);

    connection.connect(function (error) {
      if (error) {
      	// can't reconnect to the database, exiting
        process.exit(1);
      }
    });
  });
}

module.exports.connect = function () {
	connection.connect();
};
module.exports.connection = function () {
	return connection;
};
module.exports.getUserById = function(user_id,callback){
	connection.query('SELECT * FROM players WHERE user_id = ?',[user_id], function(err, rows, fields) {
		if (err){
			throw err;
		}
		if(rows.length){
			// User  exist
			callback(rows);
		}else{
			// User do not exist in db
			callback(false);
		}
	});
};
module.exports.getUserByAuth = function(username,password,callback){

	connection.query('SELECT * FROM players WHERE user_id = ? AND password = ?',[user_id,password], function(err, rows, fields) {
		if (err){
			callback(err,null);
		}
		if(rows.length){
			// User  exist
			callback(null,rows[0]);
		}else{
			// User do not exist in db
			callback("Mauvais combinaison",null);
		}
	});	
}
module.exports.getClassNameByUserId = function(user_id,callback){
	var q = ["SELECT classes.class_name",
			"FROM classes,players",
			"WHERE players.user_id = ? ",
			"AND players.class_id = classes.id"
			].join(' ');
	connection.query(q,[user_id], function(err, rows, fields) {
		if (err){
			throw err;
		}
		console.log(user_id);
		console.log(rows);
		if(rows.length){
			// User  exist
			callback(rows[0].class_name);
		}else{
			// User do not exist in db
			callback(false);
		}
	});
};

/*
* Will do class table linked on "class_name" colum (unique identifier)
*/

module.exports.getClasses = function(callback){
	connection.query('SELECT class_name FROM classes', function(err, rows, fields) {
		if (err){
			throw err;
		}
		if(rows.length){
			// User  exist
			callback(rows);
		}else{
			// User do not exist in db
			callback(false);
		}
	});
};

module.exports.getClassIdByName = function(class_name,callback){
	connection.query('select id FROM classes WHERE class_name = ? ORDER BY id ASC',[class_name],function(err,rows,fields){
		if(err){
			throw err;
		}
		callback(rows[0].id);
	});
};

module.exports.getClassNameById = function(id,callback){
	connection.query('select class_name FROM classes WHERE id = ?',[id],function(err,rows,fields){
		if(err){
			throw err;
		}
		callback(rows[0].class_name);
	});
};

module.exports.setClassForUser = function(user_id,class_name,callback){
	var q =["UPDATE players SET class_id =",
				"(SELECT classes.id",
				"FROM classes",
				"WHERE class_name = ?)",
			"WHERE players.user_id = ?"].join(' ');
	connection.query(q,[class_name,user_id], function(err, rows, fields) {
		if (err){
			console.log(err);
			if(err.code == "ER_NO_REFERENCED_ROW_2"){
				callback(false);
				return;
			}
			throw err;
		}
		console.log("db.setClassForUser(",user_id,class_name,"callback");
		console.log("rows ***",rows);
		if(rows){
			// updated
			callback(true);
		}else{
			// User do not exist in db
			callback(false);
		}
	});
};

module.exports.isAdmin =  function(user_id,callback){
	connection.query('SELECT role FROM players WHERE role = 1 AND user_id = ?',[user_id],function(err,rows,fields){
		if(err){
			throw err;
		}
		if(rows.length){
			callback(true);
		}else{
			callback(false);
		}
	});
};

module.exports.addClass = function(class_name,description,callback){
	var c = {
		class_name : class_name,
		description : description
	};

	connection.query('INSERT INTO classes SET ?', c,function(err,result){
		if(err){
			console.log(err.code);
		}
		callback(result,err);
	});
};

module.exports.getTeamIdByUserId = function(user_id,callback){
	connection.query('SELECT class_name FROM players WHERE user_id = ?', [user_id], function(err, rows, fields) {
		if (err){
			throw err;
		}

		if(rows.length){
			// User  exist
			callback(rows[0].class_name);
		}else{
			// User do not exist in db
			callback(false);
		}
	});
};

module.exports.getTopUserByGold = function(callback){
	connection.query('SELECT * FROM players ORDER BY gold DESC LIMIT 10', function(err, rows, fields) {
		if (err){
			throw err;
		}
		callback(rows);
		
	});
};

module.exports.getTopUserByClassName = function(class_name,callback){
	var q =["SELECT players.user_id, players.gold, classes.id as class_id, classes.class_name as class_name",
			"FROM players,classes",
			"WHERE classes.id = players.class_id",
			"AND classes.class_name = ?",
			"ORDER BY gold DESC LIMIT 10"
			].join(' ');

	connection.query(q, [class_name], function(err, rows, fields) {
		if (err){
			throw err;
		}
		/* output :
		/user_id |class_id | class_name
		/ edznux | 1       | developer
		/  bob   | 1       | developer
		*/
		callback(rows);
	});
};

module.exports.createUser = function(user_id,team_id,class_id,gold,role,callback){

	this.getUserById(user_id,function(exist){

		if(exist){
			callback(false);
		}else{
			var player = {
				user_id : user_id,
				team_id : team_id,
				class_id : class_id,
				gold : gold,
				created_at : Date.now(),
				role: role || 0,
				updated_at : Date.now()
			};

			connection.query('INSERT INTO players SET ?', player,function(err,result){
				console.log('user :', user_id, 'created');
				// console.log(result);
				if (err) {
					if(err.code == "ER_DUP_ENTRY"){
						console.log("duplicate !!!");
						callback(false);
					}
					throw err;
				}
				callback(result);
			});
		}
	});
};

module.exports.getGoldByUserId = function (user_id,callback) {
	connection.query('SELECT gold AS gold FROM players WHERE user_id=?',[user_id], function(err, rows, fields) {
		if (err){
			throw err;
		}

		console.log('gold :', rows[0]);
			
		if(rows.length){
			callback(rows[0].gold);
			return;
		}

		callback(0);
	});
};

module.exports.addGold = function (user_id,amount,callback) {

	connection.query('UPDATE players SET gold = gold + ? WHERE user_id=?',[amount,user_id], function(err, result) {
		if (err){
			console.log("Error in addGold function ",err);
			callback(false);
			return;
		}

		console.log('add gold :', result);
		if(result){
			callback(true);
			return;
		}else{
			callback(false);
			return;
		}
	});
};

module.exports.subGold = function (user_id,amount,callback) {

	connection.query('UPDATE players SET gold = gold - ? WHERE user_id=?',[amount,user_id], function(err, result) {
		if (err){
			console.log("Error in subGold function ",err);
			callback(false);
			// throw err;
		}

		console.log('sub result :', result);
		if(result){
			callback(true);
		}else{
			callback(false);
		}

	});
};
module.exports.updateUser = function(user_id,gold,class_id,updated_at,role,team_id,last_message_at,callback){
	var query = [];
	var q = "UPDATE players SET ";

	if(gold !== null){
		query.push("gold = "+mysql.escape(gold));
	}

	if(class_id !== null){
		query.push("class_id = "+mysql.escape(class_id));
	}
	
	if(updated_at !== null){
		console.log("ESACPED UPDATED AT",mysql.escape(updated_at));
		query.push("updated_at = "+ mysql.escape(updated_at));
	}

	if(role !== null){
		query.push("role = "+mysql.escape(role));
	}

	if(team_id !== null){
		query.push("team_id = "+mysql.escape(team_id));
	}

	if(last_message_at !== null){
		query.push("last_message_at = "+mysql.escape(last_message_at));
	}


	q+= query.join(' , ');
	q+=" WHERE user_id = "+mysql.escape(user_id);

	console.log(q);
	connection.query(q,function(err,result){
		if(err){
			console.log(err);
			throw err;
		}
		callback(result);
	});
};

module.exports.getCommands = function(callback){
	connection.query('SELECT * FROM commands', function(err, rows, fields) {
		if (err){
			throw err;
		}
			
		if(rows.length){
			callback(rows);
			return;
		}

		callback({});
	});
};

module.exports.getTriggersForCommand = function(id, callback){
	var query = [
					"SELECT triggers.name as name",
					"FROM triggers",
					"JOIN commands_triggers",
					"ON commands_triggers.id_trigger = triggers.id",
					"JOIN commands",
					"ON commands_triggers.id_command = commands.id",
					"WHERE commands.id = ?",
				].join(" ");

	connection.query(query, [id], function(err, rows, fields) {
		if (err){
			throw err;
		}
			
		if(rows.length){
			callback(rows);
			return;
		}

		callback({});
	});
};

module.exports.getTriggersForCommandName = function(name, callback){
	var query = [
					"SELECT triggers.name as name",
					"FROM triggers",
					"JOIN commands_triggers",
					"ON commands_triggers.id_trigger = triggers.id",
					"JOIN commands",
					"ON commands_triggers.id_command = commands.id",
					"WHERE commands.id = (SELECT id FROM commands WHERE name = ?)",
				].join(" ");

	connection.query(query, [name], function(err, rows, fields) {
		if (err){
			throw err;
		}
			
		if(rows.length){
			callback(rows);
			return;
		}

		callback({});
	});
};

module.exports.toggleCommandStatus = function(id,callback){
	var query = "UPDATE commands SET active = 1 - active WHERE id = ?";

	connection.query(query, [id], function(err, status){
		if (err){
			throw err;
		}
		console.log(status);
		callback(true);
	});
};

module.exports.changeCommandFileName = function(id,newFileName,callback){
	var query = "UPDATE commands SET file_name = ? WHERE id = ?";

	connection.query(query, [newFileName,id], function(err, status){
		if (err){
			throw err;
		}
		console.log(status);
		callback(true);
	});
};

module.exports.changeCommandName = function(id,newName,callback){
	var query = "UPDATE commands SET name = ? WHERE id = ?";

	connection.query(query, [newName,id], function(err, status){
		if (err){
			throw err;
		}
		console.log(status);
		callback(true);
	});
};

module.exports.close = function(){
	connection.end();
};
