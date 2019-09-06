var express = require('express');
var app = express();
var fs = require('fs');
 
 app.use(express.static('.'));
 
app.get('/', function (req, res) {
   res.sendfile('./index.html');
})
 
var server = app.listen(3000, function () {
   var port = server.address().port
   console.log("Port:", port)

})