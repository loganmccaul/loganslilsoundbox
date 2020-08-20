// Startup Express App
var express = require('express');
var cfenv = require('cfenv');
var app = express();
var http = require('http')
var server = http.Server(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 3000);

// routing
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

var appEnv = cfenv.getAppEnv();
var sounds = [];

for(var i = 0; i < 400; i++){
	sounds.push(0);
}

var numberOfUsers = 0;

io.sockets.on('connection', function (socket) {
  console.log('Connected Sockets');
	numberOfUsers++;
	socket.emit('userCountChange', numberOfUsers);
	socket.on('getSetSounds', function() {
		socket.emit('setSounds', sounds);
	});
	socket.on('getStartNote', function(note) {
		socket.broadcast.emit('startNote', note);
		sounds[note] = 1;
	});
	socket.on('getStopNote', function(note) {
		socket.broadcast.emit('stopNote', note)
		sounds[note] = 0;
	});
	socket.on('disconnect', function (socket) {
		numberOfUsers--;
		if(numberOfUsers > 0) io.emit('userCountChange', numberOfUsers);
	});
});
