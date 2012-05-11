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
// Maps a Device to a Client
var devices = {};

// List of sessions registered to the server
var sessions = {};

// Maps of devices to sessions
var device2Session = {}

everyone.now.serverCreateSession = function(sid){
	console.log('Session: ' + sid + ' Created');
	
	// Update Server's sessions lists
	sessions[sid] = true;
	
	// Update all current user's sessions
	everyone.now.clientAddSession(sid);

};

everyone.now.serverDeleteSession = function(sid) {
	console.log('Session: ' + sid + ' Deleted');
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

everyone.now.serverAddDeviceToSession = function(did, sid) {
	// Ignore adding to the same session
	if(device2Session[devices[did]] == sid) {
		return;
	}
	
	// Update NowJS group
	var sessionGroup = now.getGroup(sid);
	sessionGroup.addUser(devices[did])

	// Remove user from old session
	everyone.now.serverRemoveDeviceFromSession(did, device2Session[devices[did]])
	
	// Update Server's database
	device2Session[devices[did]] = sid;
	
	console.log('Device: '+did+' added to Session: '+sid+ " with ClientId: "+devices[did]);
}

everyone.now.serverRemoveDeviceFromSession = function(did, sid) {
	// Device was never in a session
	if(device2Session[devices[did]] == null) {
		return;
	}
	// If sid is not specified, remove device from previous session
	else if(sid == null) {
		sid = device2Session[devices[did]];
	}
	
	// Update NowJS group
	var sessionGroup = now.getGroup(sid);
	sessionGroup.removeUser(devices[did])
	
	// Update Server's database
	device2Session[devices[did]] = null;
	
	console.log('Device: '+did+' removed from Session: '+sid+ " with ClientId: "+devices[did]);	
}

everyone.now.serverAddDevice = function(name) {
	console.log(name+" connected");
	
	// Update Server's devices lists
	devices[name] = this.user.clientId;
	
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
