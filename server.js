// Setting Up Server
var static = require('node-static'),
	file = new(static.Server)('./public', {cache: 0}),
	exec = require('child_process').exec,
	now = require('now'),
	fs = require('fs'),
	url = require('url'),
	mysql = require('mysql'),
	querystring = require('querystring');
	
var server = require('http').createServer(function (request, response) {
	var path = url.parse(request.url).pathname;
	
    request.addListener('end', function () {
    	
		file.serve(request, response);
    });
});
server.listen(1111);
console.log('Server Listening on Port: ' + 1111);

// Setting up NowJS
var everyone = now.initialize(server);

// List of devices registered to the server
var devices = {};
// List of sessions registered to the server
var sessions = {};

everyone.now.serverAddSession = function(sid){
	console.log('session: ' + sid + ' added');
	
	// Update Server's sessions lists
	sessions[sid] = true;
	
	// Update all current user's sessions
	everyone.now.clientReceiveSession(sid);

};

everyone.now.serverDeleteSession = function(sid) {
	console.log('session: ' + sid + ' deleted');
	// Update Server's sessions lists
	sessions[sid] = false;
	
	// Update all current user's sessions
	everyone.now.clientDeleteSession(sid);
}

everyone.now.serverLoadSessions = function() {
	// Load all current sessions for the new client
	for(var session in sessions){
		if(sessions[session]){
			console.log("loading sessions: " + session);
			this.now.clientReceiveSession(session);
		}
	}
}

everyone.now.serverAddDevice = function(name) {
	console.log(name+" connected");
	
	// Update Server's devices lists
	devices[name] = true
	
	// Update all current user's devices
	everyone.now.clientAddDevice(name);
};

everyone.now.serverLoadDevices = function() {
	// Load all current devices for the new client
	for(var device in devices) {
		if(devices[device]) {
			console.log("loading device: "+device);
			this.now.clientAddDevice(device);
		}
	}
}

everyone.disconnected(function() {
	console.log(this.now.name+" disconnected")
	
	if(typeof(everyone.now.clientRemoveDevice) != "undefined") {
		everyone.now.clientRemoveDevice(this.now.name);
		devices[this.now.name] = false;
	}
}); 
