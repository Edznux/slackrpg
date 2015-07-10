module.exports.botToken = process.env.BOT_KEY;

module.exports.db = {
	host :process.env.DB_HOST,
	user : process.env.DB_USER,
	password : process.env.DB_PASS,
	database : process.env.DB_DB
};