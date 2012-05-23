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

// List of devices registered to the server (Device -> ClientId)
var devices = [];

// List of users registered to the server (ClientId -> Device)
var users = [];

// List of sessions registered to the server (sId -> session leader (clientId) )
var sessions = [];

// Maps of devices to sessions
var device2Session = [];

everyone.now.serverCreateSession = function(sId) {
	console.log('Session: ' + sId + ' Created.');
	
	// Update Server's sessions lists
	sessions[sId] = this.user.clientId;
	
	// Update all current user's sessions
	everyone.now.clientAddSession(sId);
	
	// Add the current Device to the session
	this.now.serverAddDeviceToSession(users[this.user.clientId], sId);

};

everyone.now.serverDeleteSession = function(sId) {
	console.log('Session: ' + sId + ' Deleted.');
	// Update Server's sessions lists
	sessions[sId] = null;
	
	// Update all current user's sessions
	everyone.now.clientDeleteSession(sId);
	
	// Remove all devices from this session
	now.getGroup(sId).getUsers(function (usersList) { 
		for (var i = 0; i < usersList.length; i++) {
			now.getClient(usersList[i], function() {
				this.now.serverRemoveDeviceFromSession(users[usersList[i]], sId);
				everyone.now.serverSetDeviceOffset(users[usersList[i]], 100, 100);
			});
		}
	});
	
	// Update Positioning of Devices
	everyone.now.serverLoadSessions();
}

everyone.now.serverLoadSessions = function() {
	var targetClient = this;
	
	console.log(this.user.clientId+' Loading Sessions...');
	// Load all current sessions for the new client
	for(var sId in sessions){
		if(sessions[sId] != null){
			console.log("\t" + sId);
			this.now.clientAddSession(sId);
			
			// Move Devices to Session
			now.getGroup(sId).getUsers(function (usersList) { 
				for (var i = 0; i < usersList.length; i++) {
					targetClient.now.clientMoveDeviceIconToSession(users[usersList[i]], sId);
				}
			});
		}
	}
	console.log(this.user.clientId+' Loading Complete');
}

everyone.now.serverAddDeviceToSession = function(dId, sId) {
	// Ignore adding to the same session
	if(device2Session[devices[dId]] == sId) {
		console.log(dId+" already in this session "+sId+", so device not added.");
		return;
	}
	
	// Update NowJS group
	var sessionGroup = now.getGroup(sId);
	sessionGroup.addUser(devices[dId])

	// Remove user from old session
	this.now.serverRemoveDeviceFromSession(dId, device2Session[devices[dId]]);
	
	// Update Server's database
	device2Session[devices[dId]] = sId;
	
	console.log('Device: '+dId+' added to Session: '+sId+ " with ClientId: "+devices[dId]);
}

everyone.now.serverRemoveDeviceFromSession = function(dId, sId) {
	var targetClient = this;
	// Device was never in a session
	if(device2Session[devices[dId]] == null) {
		console.log(dId+" not removed because was never in a session.");
		return;
	}
	// If sId is not specified, remove device from previous session
	else if(sId == null) {
		sId = device2Session[devices[dId]];
	}
	
	// Update NowJS group
	var sessionGroup = now.getGroup(sId);
	sessionGroup.removeUser(devices[dId])
	
	// Update Server's database
	device2Session[devices[dId]] = null;
	
	console.log('Device: '+dId+' removed from Session: '+sId+ " with ClientId: "+devices[dId]);	
	
	// Delete Empty Session
	sessionGroup.count(function (ct) { 
	  if(ct == 0) {
	  	console.log("Deleting Session: "+sId+" because its empty.")
	  	targetClient.now.serverDeleteSession(sId);
	  }
	});
}

everyone.now.serverGetDevicesFromSession = function(sId) {
	var targetClient = this;
	now.getGroup(sId).getUsers(function (usersList) { 
		var listOfDevices = [];
		for (var i = 0; i < usersList.length; i++) {
			listOfDevices.push(users[usersList[i]]);
		}
		console.log("Sending list: "+listOfDevices);
		targetClient.now.clientGetDevicesFromSession(listOfDevices);
	});
}

everyone.now.serverMoveDeviceIconToSession = function(dId, sId) {
	everyone.now.clientMoveDeviceIconToSession(dId, sId);
}

everyone.now.serverAddDevice = function(dId) {
	console.log(dId+" connected");
	
	// Update Server's devices lists
	devices[dId] = this.user.clientId;
	
	// Update Server's user lists
	users[this.user.clientId] = dId;
	
	// Set the client's Id 
	this.now.clientSetClientId(this.user.clientId);
	
	// Update all current user's devices
	everyone.now.clientAddDevice(dId);
};

everyone.now.serverLoadDevices = function() {
	// Load all current devices for the new client
	for(var dId in devices) {
		if(devices[dId] != null) {
			console.log("loading device: "+dId);
			this.now.clientAddDevice(dId);
		}
	}
}

everyone.now.serverSetDeviceOffset = function(dId, x, y) {
	console.log('Setting '+dId+"'s offset to ("+x+', '+y+')');
	everyone.now.clientSetDeviceOffset(dId, x, y);
}

everyone.disconnected(function() {
	console.log(this.now.dId+" disconnected.")
	
	if(typeof(everyone.now.clientRemoveDevice) != "undefined") {
		everyone.now.clientRemoveDevice(this.now.dId);
		everyone.now.serverRemoveDeviceFromSession(this.now.dId, null);
		devices[this.now.dId] = null;
		console.log(this.now.dId+" removed from server.")
	}
	
	// Reset all variables, because no client is connected
	everyone.count(function (ct) { 
	  if(ct == 0) {
		console.log('Resetting all server database variables...')
		devices = [];
		users = [];
		sessions = [];
		device2Session = [];
	  }
	});
	
}); 
