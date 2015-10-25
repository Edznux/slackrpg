var express = require('express');
var app = express();

var route = require("./routes.js")(app);

var server = app.listen(7894, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});