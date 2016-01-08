var mysql		= require('mysql');

// var connection;
// var dbconfig = {
// 	host     : process.env.DB_HOST,
// 	user     : process.env.DB_USER, //'rpgbot',
// 	password : process.env.DB_PASS, //'password',
// 	database : 'rpgbot'
// };

var pool  = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : 'rpgbot'
});
// // var pool = mysql.createPool(dbconfig);
// function handleDisconnect() {
//     // Recreate the connection, since
//     // the old one cannot be reused.
//     connection = mysql.createConnection(dbconfig);

//     connection.connect(function(err) {
//         // The server is either down
//         // or restarting
//         if(err) {
//             // We introduce a delay before attempting to reconnect,
//             // to avoid a hot loop, and to allow our node script to
//             // process asynchronous requests in the meantime.
//             console.log('error when connecting to db:', err);
//             setTimeout(handleDisconnect, 2000);
//         }
//     });
//     connection.on('error', function(err) {
//         console.log('db error', err);
//         if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
//             handleDisconnect();
//         }else{
//             throw err;
//         }
//     });
// }
// connection.on()
// 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR';

// module.exports.connect = function () {
// 	handleDisconnect();
// };

// module.exports.connection = function () {
// 	return connection;
// };

module.exports.getUserById = function(user_id,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('SELECT * FROM players WHERE user_id = ?',[user_id], function(err, rows, fields) {
			if (err){
				throw err;
			}
			connection.release();
			if(rows.length){
				// User  exist
				callback(rows);
			}else{
				// User do not exist in db
				callback(false);
			}
		});
	});
};

module.exports.getUserByAuth = function(username,password,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('SELECT * FROM players WHERE user_id = ? AND password = ?',[user_id,password], function(err, rows, fields) {
			if (err){
				callback(err,null);
			}

			connection.release();
			if(rows.length){
				// User  exist
				callback(null,rows[0]);
			}else{
				// User do not exist in db
				callback("Mauvais combinaison",null);
			}
		});
	});
};

module.exports.getClassNameByUserId = function(user_id,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
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

			connection.release();

			if(rows.length){
				// User  exist
				callback(rows[0].class_name);
			}else{
				// User do not exist in db
				callback(false);
			}
		});
	});
};

/*
* Will do class table linked on "class_name" colum (unique identifier)
*/

module.exports.getClasses = function(callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('SELECT class_name FROM classes', function(err, rows, fields) {
			if (err){
				throw err;
			}

			connection.release();

			if(rows.length){
				// User  exist
				callback(rows);
			}else{
				// User do not exist in db
				callback(false);
			}
		});
	});
};

module.exports.getClassIdByName = function(class_name,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('select id FROM classes WHERE class_name = ? ORDER BY id ASC',[class_name],function(err,rows,fields){
			if(err){
				throw err;
			}

			connection.release();
			callback(rows[0].id);
		});
	});
};

module.exports.getClassNameById = function(id,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('select class_name FROM classes WHERE id = ?',[id],function(err,rows,fields){
			if(err){
				throw err;
			}
			connection.release();
			callback(rows[0].class_name);
		});
	});
};

module.exports.setClassForUser = function(user_id,class_name,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
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

			connection.release();

			if(rows){
				// updated
				callback(true);
			}else{
				// User do not exist in db
				callback(false);
			}
		});
	});
};

module.exports.isAdmin =  function(user_id,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('SELECT role FROM players WHERE role = 1 AND user_id = ?',[user_id],function(err,rows,fields){
			if(err){
				throw err;
			}

			connection.release();

			if(rows.length){
				callback(true);
			}else{
				callback(false);
			}
		});
	});
};

module.exports.addClass = function(class_name,description,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		var c = {
			class_name : class_name,
			description : description
		};

		connection.query('INSERT INTO classes SET ?', c,function(err,result){
			if(err){
				console.log(err.code);
			}

			connection.release();
			callback(result,err);
		});
	});
};

module.exports.getTeamIdByUserId = function(user_id,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('SELECT class_name FROM players WHERE user_id = ?', [user_id], function(err, rows, fields) {
			if (err){
				throw err;
			}

			connection.release();
			if(rows.length){
				// User  exist
				callback(rows[0].class_name);
			}else{
				// User do not exist in db
				callback(false);
			}
		});
	});
};

module.exports.getTopUserByGold = function(callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('SELECT * FROM players ORDER BY gold DESC LIMIT 10', function(err, rows, fields) {
			if (err){
				throw err;
			}
			connection.release();
			callback(rows);
			
		});
	});
};

module.exports.getTopUserByClassName = function(class_name,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
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
			connection.release();
			callback(rows);
		});
	});
};

module.exports.createUser = function(user_id,team_id,class_id,gold,role,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
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
					connection.release();
					callback(result);
				});
			}
		});
	});
};

module.exports.getGoldByUserId = function (user_id,callback) {
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('SELECT gold AS gold FROM players WHERE user_id=?',[user_id], function(err, rows, fields) {
			if (err){
				throw err;
			}

			console.log('gold :', rows[0]);
				
			connection.release();
			if(rows.length){
				callback(rows[0].gold);
				return;
			}

			callback(0);
		});
	});
};

module.exports.addGold = function (user_id,amount,callback) {
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('UPDATE players SET gold = gold + ? WHERE user_id=?',[amount,user_id], function(err, result) {
			if (err){
				console.log("Error in addGold function ",err);
				callback(false);
				return;
			}

			console.log('add gold :', result);
			connection.release();
			if(result){
				callback(true);
				return;
			}else{
				callback(false);
				return;
			}
		});
	});
};

module.exports.subGold = function (user_id,amount,callback) {
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('UPDATE players SET gold = gold - ? WHERE user_id=?',[amount,user_id], function(err, result) {
			if (err){
				console.log("Error in subGold function ",err);
				callback(false);
				// throw err;
			}

			console.log('sub result :', result);
			connection.release();
			if(result){
				callback(true);
			}else{
				callback(false);
			}

		});
	});
};
module.exports.updateUser = function(user_id,gold,class_id,updated_at,role,team_id,last_message_at,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
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
			connection.release();
			callback(result);
		});
	});
};

module.exports.getCommands = function(callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		connection.query('SELECT * FROM commands', function(err, rows, fields) {
			if (err){
				throw err;
			}
				
			connection.release();
			
			if(rows.length){
				callback(rows);
				return;
			}

			callback({});
		});
	});
};

module.exports.getTriggersForCommand = function(id, callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
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
				
			connection.release();
			if(rows.length){
				callback(rows);
				return;
			}

			callback({});
		});
	});
};

module.exports.getTriggersForCommandName = function(name, callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
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
				
			connection.release();
			if(rows.length){
				callback(rows);
				return;
			}

			callback({});
		});
	});
};

module.exports.toggleCommandStatus = function(id,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		
		var query = "UPDATE commands SET active = 1 - active WHERE id = ?";

		connection.query(query, [id], function(err, status){
			if (err){
				throw err;
			}
			connection.release();
			console.log(status);
			callback(true);
		});
	});
};

module.exports.changeCommandFileName = function(id,newFileName,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}

		var query = "UPDATE commands SET file_name = ? WHERE id = ?";

		connection.query(query, [newFileName,id], function(err, status){
			if (err){
				throw err;
			}
			console.log(status);
			connection.release();
			callback(true);
		});
	});
};

module.exports.changeCommandName = function(id,newName,callback){
	pool.getConnection(function(error, connection) {
		if(error){
			console.error("Error in the getConnection from the pool : ");
			console.error(error);
			callback(null);
		}
		var query = "UPDATE commands SET name = ? WHERE id = ?";

		connection.query(query, [newName,id], function(err, status){
			if (err){
				throw err;
			}
			console.log(status);
			connection.release();
			callback(true);
		});
	});
};

module.exports.close = function(){
	connection.end();
};