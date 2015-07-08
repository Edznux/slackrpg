var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'rpgbot',
	password : 'QvqEXTcQV8fVBHuw',
	database : 'rpgbot'
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
}

module.exports.getClassNameUserByName = function(user_name,callback){
	connection.query('SELECT class_name FROM players WHERE user_name = ?',[user_name], function(err, rows, fields) {
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
}

/*
* Will do class table linked on "class_name" colum (unique identifier)
*/
module.exports.getClass = function(callback){
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
}

module.exports.setClassForUser = function(user_name,class_name,callback){
	connection.query('UPDATE players SET class_id = (SELECT id FROM classes where class_name =? ) WHERE user_name = ?',[class_name,user_name], function(err, rows, fields) {
		if (err){
			throw err;
		}

		console.log("db.setClassForUser(",user_name,class_name,"callback");
		if(rows){
			// updated
			callback(true);
		}else{
			// User do not exist in db
			callback(false);
		}
	});
}
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
}
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
}

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
}

module.exports.getTopUserByGold = function(callback){
	connection.query('SELECT * FROM players ORDER BY gold DESC LIMIT 10', function(err, rows, fields) {
		if (err){
			throw err;
		} 
		callback(rows);
		
	});
}

module.exports.getTopUserByClass = function(className,callback){
	connection.query('SELECT * FROM players WHERE class_name = ? ORDER BY gold DESC LIMIT 10', [className], function(err, rows, fields) {
		if (err){
			throw err;
		} 
		callback(rows);
		
	});
}

module.exports.createUser = function(user_name,channel_name,team_id,className,gold,callback){
	var player = {
		user_name : user_name,
		class_name : className,
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
}

module.exports.getGoldByUserName = function (user_name,callback) {
	console.log('user : ', user_name,' requested gold');
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
}
module.exports.addGold = function (user_name,amount,callback) {

	connection.query('UPDATE players SET gold = gold + ? WHERE user_name=?',[amount,user_name], function(err, rows, fields) {
		if (err){
			throw err;
		} 

		console.log('gold :', rows);
			
		if(rows.length){
			callback(rows[0].gold);
			return;
		}

		callback(0);
	});
}
module.exports.subGold = function (user_name,amount,callback) {

	connection.query('UPDATE players SET gold = gold - ? WHERE user_name=?',[amount,user_name], function(err, rows, fields) {
		if (err){
			throw err;
		} 

		console.log('gold :', rows);
			
		if(rows.length){
			callback(rows[0].gold);
			return;
		}

		callback(0);
	});
}

module.exports.close = function(){
	connection.end();
}