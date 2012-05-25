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
    	
    	// Returns a list of devices tied to a session
    	// Ex: /sessionDevices?sId=sessionName
    	if(path == '/sessionDevices') {
    		var sId = querystring.parse(url.parse(request.url).query)['sId'];
    		console.log('Finding Devices for Session: '+sId);
    		response.writeHead(200, {"Content-Type": "application/json"});
    		
    		// Build Devices List
    		var devices = [];
    		for(dId in device2Session) {
    			if(device2Session[dId] == sId) {
    				var device = {};
    				device['device'] = users[dId];
    				
    				// Session Leader Check
    				if(sessions[sId] == dId)
    					device['leader'] = 1;
    				else
    					device['leader'] = 0;
    				
    				devices.push(device);
    			}
    		}
    		
			response.write(JSON.stringify(devices, null, 4));
			response.end();
    	}
    	else
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
	this.now.serverAddDeviceToSession(users[this.user.clientId], sId);

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
				this.now.serverRemoveDeviceFromSession(users[usersList[i]], sId);
				everyone.now.serverSetDeviceOffset(users[usersList[i]], 100, 100);
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
	
	console.log(users[this.user.clientId]+' Loading Sessions');
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
	console.log(users[this.user.clientId]+' Loading Completed');
}

// Adds Device to Server's Session
// Requests a removal of device from old session
// Call Path: 1 Client -> Server -> 1 Clients
// Tells all clients to move the device icon to the session
// Call Path: 1 Client -> Server -> All Clients
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
	
	// Tell all Clients to move Device Icon into session
	everyone.now.clientMoveDeviceIconToSession(dId, sId);
	
	console.log('Device: '+dId+' added to Session: '+sId+ " with ClientId: "+devices[dId]);
}

// Removes Device from a Session
// If the session becomes empty, delete it
// Call Path: 1 Client -> Server -> 1 Clients
// Updates Session Leader on the server if needed
everyone.now.serverRemoveDeviceFromSession = function(dId, sId) {
	var targetClient = this;
	// Device was never in a session or already removed
	if(device2Session[devices[dId]] == null) {
		console.log(dId+" not removed because was not in a session or already removed.");
		return;
	}
	// If sId is not specified, remove device from previous session
	else if(sId == null) {
		sId = device2Session[devices[dId]];
	}
	
	// Update NowJS group
	var sessionGroup = now.getGroup(sId);
	sessionGroup.removeUser(devices[dId])
	
	// Update Server's database on what session is the device in
	device2Session[devices[dId]] = null;
	
	console.log('Device: '+dId+' removed from Session: '+sId);	
	
	// Delete Empty Session
	sessionGroup.count(function (ct) { 
	  if(ct == 0) {
	  	console.log("Deleting Session: "+sId+" because its empty.")
	  	targetClient.now.serverDeleteSession(sId);
	  }
	  else {
		// Update Session Leader if device leaves
		if(devices[dId] == sessions[sId]) {
			// Select First User
			now.getGroup(sId).getUsers(function (usersList) { 
				sessions[sId] = usersList[0];
				console.log('New Session Leader for '+sId+' is '+users[usersList[0]]);
			});
		}
	  }
	});	
}


// Called from one client to move a devices to (x,y) for all devices 
// Call Path: 1 Client -> Server -> All Clients
everyone.now.serverSetDeviceOffset = function(dId, x, y) {
	console.log('Setting '+dId+"'s offset to ("+x+', '+y+')');
	everyone.now.clientSetDeviceOffset(dId, x, y);
}

// Registers Device to Server
// Call Path: 1 Client -> Server -> All Clients
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

// Loads all the devices for a client
// Call Path: 1 Client -> Server -> 1 Client 
everyone.now.serverLoadDevices = function() {
	// Load all current devices for the new client
	for(var dId in devices) {
		if(devices[dId] != null) {
			console.log("Load device: "+dId);
			this.now.clientAddDevice(dId);
		}
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
