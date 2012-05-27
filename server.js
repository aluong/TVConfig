// Setting Up Server
var exec = require('child_process').exec,
    now = require('now'),
    fs = require('fs'),
    url = require('url'),
    querystring = require('querystring'),
    express = require('express');

var server = express.createServer();

// Returns a list of devices tied to a session
// Ex: /sessionDevices?sId=sessionName
server.get('/sessionDevices', function(request, response) {
		var sId = request.param('sId');
		console.log('Finding Devices for Session: '+sId);
		
		// Build Devices List
		var sessionDevices = [];
		for(var i = 0; i < devices.length; i++) {
			var device = devices[i];
			if(device['sId'] == sId) {
				// Session Leader Check
				if(sessions[sId] == device['cId'])
					device['leader'] = 1;
				else
					device['leader'] = 0;
				
				sessionDevices.push(device);
			}
		}
		response.send(JSON.stringify(sessionDevices, null, 4), {"Content-Type": "application/json"});
});

// Returns a list of media tied to a session
// Ex: /media?sId=sessionName
server.get('/media', function(request, response) {
		var sId = request.param('sId');
		console.log('Finding Media for Session: '+sId);
		
		// **************  INCOMPLETE  **************
		// NEED TO WRITE LOGIC FOR CUSTOM MEDIA PER SESSION
		// **************  INCOMPLETE  **************
		
		// Build Devices List
		var media = [ 
					{'name': 'BigBuck-P1', 'url': '/resources/videos/BigBuck.m4v', 'cover':'/resources/img/cover.png'}, 
					{'name': 'BigBuck-P2', 'url': '/resources/videos/BigBuck2.mp4', 'cover':'/resources/img/cover2.png'}
					];
		
		response.send(JSON.stringify(media, null, 4), {"Content-Type": "application/json"});
});

// General Static Files
server.use(express.static(__dirname + '/public'));

server.listen(1111);
console.log('Server Listening on Port: ' + 1111);

// Setting up NowJS
var everyone = now.initialize(server);

// List of devices registered to the server
// Properties: name, cId, sId, leader
var devices = [];

// List of sessions registered to the server (sId -> session leader (clientId) )
var sessions = [];


// Creates a new Session
// Call Path: 1 Client -> Server -> All clients
everyone.now.serverCreateSession = function(sId) {
	console.log('Session: ' + sId + ' Created.');
	
	// Update Server's Session Leader
	sessions[sId] = this.user.clientId;
	
	// Update all current user's sessions
	everyone.now.clientAddSession(sId);
	
	// Add the current Device to the session
	// Call to a server method
	this.now.serverAddDeviceToSession(this.user.clientId, sId);

};

// Deletes a session
// Call Path: 1 Client -> Server -> All Clients
// Removes all Devices from server
// Call Path: 1 Client -> Server
// Moves all Devices out
// Call Path: Server -> All Clients
// Reload all Sessions, since icons moved
// Call Path: Server -> All Clients
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
				this.now.serverRemoveDeviceFromSession(usersList[i], sId);
				everyone.now.serverSetDeviceOffset(usersList[i], 100, 100);
			});
		}
	});
	
	// Update Positioning of Devices
	everyone.now.serverLoadSessions();
}

// Loads all the session for a client
// Call Path: 1 Client -> Server -> 1 Client
everyone.now.serverLoadSessions = function() {
	var targetClient = this;
	
	console.log(this.user.clientId+' Loading Sessions');
	// Load all current sessions for the new client
	for(var sId in sessions){
		if(sessions[sId] != null && typeof(sessions[sId]) != 'function') {
			console.log("\t" + sId);
			this.now.clientAddSession(sId);
			
			// Move Devices to Session
			now.getGroup(sId).getUsers(function (usersList) { 
				for (var i = 0; i < usersList.length; i++) {
					targetClient.now.clientMoveDeviceIconToSession(usersList[i], sId, i);
				}
			});
		}
	}
	console.log(this.user.clientId+' Loading Completed');
}

// Adds Device to Server's Session
// Requests a removal of device from old session
// Call Path: 1 Client -> Server -> 1 Clients
// Tells all clients to move the device icon to the session
// Call Path: 1 Client -> Server -> All Clients
everyone.now.serverAddDeviceToSession = function(cId, sId) {
	var device = devices.findDevice(cId);
	// Ignore adding to the same session
	if(device['sId'] == sId) {
		console.log(cId+" already in this session "+sId+", so device not added.");
		return;
	}
	
	// Update NowJS group
	var sessionGroup = now.getGroup(sId);
	sessionGroup.addUser(cId)

	// Remove user from old session
	this.now.serverRemoveDeviceFromSession(cId, device['sId']);
	
	// Update Server's database
	device['sId'] = sId;
	
	// Tell all Clients to move Device Icon into session
	var k = 0;
	for(var i = 0; i < devices.length; i++){
		if(devices[i]['sId'] == sId){
			everyone.now.clientMoveDeviceIconToSession(devices[i]['cId'], sId, k);
			k++;
		}
	}
	
	// Reload Session-Details
	everyone.now.reloadSessionDetails(sId);
	
	console.log('Client: '+cId+' added to Session: '+sId);
}

// Removes Device from a Session
// If the session becomes empty, delete it
// Call Path: 1 Client -> Server -> 1 Clients
// Updates Session Leader on the server if needed
everyone.now.serverRemoveDeviceFromSession = function(cId, sId) {
	var targetClient = this;
	var device = devices.findDevice(cId);
	// Device was never in a session or already removed
	if(device['sId'] == null) {
		console.log(cId+" not removed because was not in a session or already removed.");
		return;
	}
	// If sId is not specified, remove device from previous session
	else if(sId == null) {
		sId = device['sId'];
	}
	
	// Update NowJS group
	var sessionGroup = now.getGroup(sId);
	sessionGroup.removeUser(cId)
	
	// Update Server's database on what session is the device in
	device['sId'] = null;
	
	console.log('Client: '+cId+' removed from Session: '+sId);	
	
	// Delete Empty Session
	sessionGroup.count(function (ct) { 
	  if(ct == 0) {
	  	console.log("Deleting Session: "+sId+" because its empty.")
	  	targetClient.now.serverDeleteSession(sId);
	  }
	  else {
		// Update Session Leader if device leaves
		if(sessions[sId] == cId) {
			// Select First User
			now.getGroup(sId).getUsers(function (usersList) { 
				sessions[sId] = usersList[0];
				console.log('New Session Leader for '+sId+' is '+cId);
			});
		}
		
		// Reload Session-Details
		everyone.now.reloadSessionDetails(sId);
	  }
	});	
}

// Called from one client to move a devices to (x,y) for all devices 
// Call Path: 1 Client -> Server -> All Clients
everyone.now.serverSetDeviceOffset = function(cId, x, y) {
	console.log('Setting '+cId+"'s offset to ("+x+', '+y+')');
	
	var k = 0;
	for(var i = 0; i < devices.length; i++){
		if(devices[i]['sId'] == null){
			everyone.now.clientSetDeviceOffset(devices[i]['cId'], x, y, k);
			k++;
		}
	}
	
	
}

// Registers Device to Server
// Call Path: 1 Client -> Server -> All Clients
everyone.now.serverAddDevice = function(name) {
	console.log(name+" connected");
	
	// Update Server's devices lists
	devices.push({'name':name, 'cId':this.user.clientId, 'sId':null, 'leader':0});
	
	// Set the client's Id 
	this.now.clientSetClientId(this.user.clientId);
	
	// Update all current user's devices
	everyone.now.clientAddDevice(name, this.user.clientId);
};

// Loads all the devices for a client
// Call Path: 1 Client -> Server -> 1 Client 
everyone.now.serverLoadDevices = function() {
	// Load all current devices for the new client
	for(var i = 0; i < devices.length; i++) {
		console.log("Load device: "+devices[i]['name']);
		this.now.clientAddDevice(devices[i]['name'], devices[i]['cId']);
	}
}

// Client Disconnected
// Remove the Device Icon from all Clients
// Call Path: 1 Client -> Server -> All Clients
// Remove Device from Session (NEED TO BE FIXED, currently all clients are calling this)
// Call Path: 1 Client -> Server -> All Clients
// Reset Variables if no client is connected.
everyone.disconnected(function() {
	console.log(this.now.dId+" disconnected.")
	
	if(typeof(everyone.now.clientRemoveDevice) != "undefined") {
		everyone.now.clientRemoveDevice(this.user.clientId);
		everyone.now.serverRemoveDeviceFromSession(this.user.clientId, null);
		devices.removeDevice(this.user.clientId);
		console.log(this.user.clientId+" removed from server.")
	}
	
	// Reset all variables, because no client is connected
	everyone.count(function (ct) { 
	  if(ct == 0) {
		console.log('Resetting all server database variables...')
		devices = [];
		sessions = [];
	  }
	});
	
}); 

// Array Prototypes
Array.prototype.findDevice = function(cId) {
  var device = false;
  for (var i=0; i<this.length; i++) {
  	if(this[i]['cId'] == cId) {
    	device = this[i];
    }
  }
  return device;
}

Array.prototype.countDevicesInSession = function(sId) {
	var count = 0;
	for(var i = 0; i < this.length; i++) {
		if(this[i]['sId'] == sId){
			count++;
		}
	}
	return count;
}

Array.prototype.removeDevice = function(cId) {
  var removed = false;
  for (var i=0; i<this.length; i++) {
    if(this[i]['cId'] == cId) {
    	this.splice(i,1);
    	removed = true;
    	break;
    }
  }
  return removed;
}