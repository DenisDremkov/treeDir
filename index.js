

var express = require("express");
var appServer = express();
var port = process.env.PORT || 3000;
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var path = require("path");
var fs = require('fs');
var fse = require('fs-extra');
var mkdirp = require('mkdirp');
var server = require('http').Server(appServer);
var io = require('socket.io')(server);
var readInfoDir = require('./app_modules/readInfoDir.js')
var socketFactory = require('./app_modules/socketFactory.js')

appServer.use(express.static(path.join(__dirname, "public")));
appServer.use(cookieParser());
appServer.use(bodyParser.json());


io.on('connection', function(socket) {
  socket.on('createListener', function(obj) {
  		socketFactory.createListener(obj, io, fs)
  });
  socket.on('destroyListener', function(obj) {
  		socketFactory.destroyListener(obj)
  });
});


appServer.get('/getStartFileStructure', function(req, res) {
	readInfoDir(res, fs, __dirname)	
});	
appServer.post('/getCurrentElementChildrens', function(req, res) {
	readInfoDir(res, fs, req.body.path.replace("///,g", "\\"))
});
appServer.post('/addNewDir', function(req, res) {
	mkdirp(__dirname + "/FOLDER_FOR_EXPERIMENTS/" + req.body.nameNewDir, function(err) {
		if (err) throw err;
		res.send()
	});
})	
appServer.post('/deleteDir', function(req, res) {
	fse.remove(req.body.path, function (err) {
	  if (err) throw err;
	})
})	
server.listen(port);
console.log('server port - 3000');


