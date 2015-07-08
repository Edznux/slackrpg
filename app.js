var express = require('express');
var bodyParser = require('body-parser');

var rpgbot = require('./rpgbot');
var db = require('./lib/db');
var app = express();
var port = process.env.PORT || 3003;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) {
	res.status(200).send('Slack use POST to /rpgbot ;), btw, hello');
});

app.post('/rpgbot', rpgbot);
// error handler
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(400).send(err.message);
});

app.listen(port, function () {
	console.log('Slack bot listening on port => ' + port);
});
