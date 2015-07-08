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
			console.log('user exist in db');
			callback(true);
		}else{
			console.log('User do not exist in db');
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

module.exports.createUser = function(user_name,className,gold,callback){
	var player = {
		user_name : user_name,
		class_name : className,
		gold : gold
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

module.exports.close = function(){
	connection.end();
}