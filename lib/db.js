var mysql		= require('mysql');
var config		= require('../config');

var connection	= mysql.createConnection({
	host     : config.db.host,
	user     : config.db.user,
	password : config.db.password,
	database : config.db.database
});


module.exports.connect = function () {
	connection.connect();
};

module.exports.getUserByName = function(user_name,callback){
	connection.query('SELECT * FROM players WHERE user_name = ?',[user_name], function(err, rows, fields) {
		if (err){
			throw err;
		}

		if(rows.length){
			// User  exist
			callback(true);
		}else{
			// User do not exist in db
			console.log('Created new user', user_name);
			callback(false);
		}
	});
};

module.exports.getClassNameByUserName = function(user_name,callback){
	var q = ["SELECT classes.class_name",
			"FROM classes,players",
			"WHERE players.user_name = ? ",
			"AND players.class_id = classes.id"
			].join(' ');
	connection.query(q,[user_name], function(err, rows, fields) {
		if (err){
			throw err;
		}
		console.log(user_name);
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

module.exports.setClassForUser = function(user_name,class_name,callback){
	var q =["UPDATE players SET class_id =",
				"(SELECT classes.id",
				"FROM classes",
				"WHERE class_name = ?)",
			"WHERE players.user_name = ?"].join(' ');
	connection.query(q,[class_name,user_name], function(err, rows, fields) {
		if (err){
			console.log(err);
			if(err.code == "ER_NO_REFERENCED_ROW_2"){
				callback(false);
				return;
			}
			throw err;
		}
		console.log("db.setClassForUser(",user_name,class_name,"callback");
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

module.exports.isAdmin =  function(user_name,callback){
	connection.query('SELECT role FROM players WHERE role = 1 AND user_name = ?',[user_name],function(err,rows,fields){
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
	}
	connection.query('INSERT INTO classes SET ?', c,function(err,result){
		if(err){
			console.log(err.code);
		}
		callback(result,err);
	});
};

module.exports.getTeamIdUserByName = function(user_name,callback){
	connection.query('SELECT class_name FROM players WHERE user_name = ?', [user_name], function(err, rows, fields) {
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
	var q =["SELECT players.user_name, players.gold, classes.id as class_id, classes.class_name as class_name",
			"FROM players,classes",
			"WHERE classes.id = players.class_id",
			"AND classes.class_name = ?",
			"ORDER BY gold DESC LIMIT 10"
			].join(' ');

	connection.query(q, [class_name], function(err, rows, fields) {
		if (err){
			throw err;
		} 
		// output : 
		//user_name |class_id | class_name
		// edznux | 1 | developer
		// bob | 1 | developer
		callback(rows);
	});
};

module.exports.createUser = function(user_name,channel_name,team_id,className,gold,callback){
	var player = {
		user_name : user_name,
		gold : gold,
		team_id : team_id,
		channel_name : channel_name,
		created_at : Date.now(),
		updated_at : Date.now()
	};

	connection.query('INSERT INTO players SET ?', player,function(err,result){
		console.log('user :', user_name, 'created');
		if (err) {
			throw err
		}
		callback(result);
	});
};

module.exports.getGoldByUserName = function (user_name,callback) {
	connection.query('SELECT gold AS gold FROM players WHERE user_name=?',[user_name], function(err, rows, fields) {
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

module.exports.addGold = function (user_name,amount,callback) {

	connection.query('UPDATE players SET gold = gold + ? WHERE user_name=?',[amount,user_name], function(err, result) {
		if (err){
			throw err;
		} 

		console.log('result :', result);
		if(result){
			callback(true)
		}else{
			callback(false);
		}
	});
};

module.exports.subGold = function (user_name,amount,callback) {

	connection.query('UPDATE players SET gold = gold - ? WHERE user_name=?',[amount,user_name], function(err, result) {
		if (err){
			callback(false);
			// throw err;
		} 

		console.log('result :', result);
		if(result){
			callback(true)
		}

	});
};

module.exports.close = function(){
	connection.end();
};