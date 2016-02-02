var express = require('express');
var app = express();

var route = require("./routes.js")(app);
var hook = require("./hook.js")(app);

var server = app.listen(process.env.WEB_PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});