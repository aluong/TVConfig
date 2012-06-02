// ---------------------------------------- //
// ----------- SERVER MODULES ------------- //
// ---------------------------------------- //

var exec = require('child_process').exec,
    now = require('now'),
    fs = require('fs'),
    url = require('url'),
    querystring = require('querystring'),
    express = require('express');

    
// -------------------------------------- //
// ----------- SERVER SETUP ------------- //
// -------------------------------------- //
    
var server = express.createServer();


// --------------------------------------- //
// ----------- SERVER ROUTES ------------- //
// --------------------------------------- //

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

// Ports
server.listen(1111);
console.log('Server Listening on Port: ' + 1111);


// ------------------------------------------ //
// ----------- SERVER VARIABLES ------------- //
// ------------------------------------------ //

// Setting up NowJS
var everyone = now.initialize(server);

// List of devices registered to the server
// Properties: name, cId, sId, leader
var devices = [];

// List of sessions registered to the server (sId -> session leader (clientId) )
//var sessions = [];
var sessions = {}; //Since the session-id is no longer a int here

//clocks
//one clock per video per session
var clocks = {};

// ----------------------------------------------- //
// ----------- VIDEO NOWJS FUNCTIONS ------------- //
// ----------------------------------------------- //

everyone.now.serverPause = function(sId, url, time){
	console.log('serverPause: '+sId+' '+url+' '+time);
	clocks[sId][url]['time'] = time;
	clocks[sId][url]['state'] = 'pause';
	
	// Need to tell all clients to pause
	everyone.now.clientPauseVideo(sId, url);
}

everyone.now.serverPlay = function(sId, url) {
	console.log('serverPlay: '+sId+' '+url);
	clocks[sId][url]['state'] = 'play';
	
	// Need to tell all clients to play
	everyone.now.clientPlayVideo(sId, url);
}

everyone.now.serverStop = function(sId, url){
	console.log('serverStop: '+sId+' '+url+' ');
	clocks[sId][url]['time'] = 0.0;
	clocks[sId][url]['state'] = 'stop';
	
	// Need to tell all clients to stop
	everyone.now.clientStopVideo(sId, url);
}

everyone.now.serverGetClock = function(sId, cId, callback){
	for(var i = 0; i < devices.length; i++){
		if(devices[i]['cId'] == cId) {
			callback(clocks[sId][devices[i]['media']]);
			break;
		}
	}
}


// ------------------------------------------------- //
// ----------- SESSION NOWJS FUNCTIONS ------------- //
// ------------------------------------------------- //

// Creates a new Session
everyone.now.serverCreateSession = function(sId) {
	console.log('Session: ' + sId + ' Created.');
	
	// Update Server's Session Leader
	sessions[sId] = this.user.clientId;
	
	// Set Client's sId
	this.now.clientSetSId(sId);
	
	// Update all current user's sessions
	everyone.now.clientAddSession(sId);
	
	// Add the current Device to the session
	// Call to a server method
	this.now.serverAddDeviceToSession(this.user.clientId, sId);

	//setup the CLOCK
	// ------------------------------------------------- //
	// THIS IS HARD-CODED WE NEED TO FIX
	// ------------------------------------------------- //
	clocks[sId] = {
		'/resources/videos/BigBuck.m4v':{
			time:0.0,
			startTime:0.0,
			state:'stop'
			},
		'/resources/videos/BigBuck2.mp4':{
			time:0.0,
			startTime:0.0,
			state:'stop'}
	};
};

// Deletes a session
// Removes all Devices from server
// Moves all Devices out
// Reload all Sessions, since icons moved
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
				this.now.serverRemoveDeviceFromSession(usersList[i], usersList[i], null, sId);
			});
		}
		serverSetDevicesOffset(null, everyone);
	});
	
	
	// Update Positioning of Devices
	everyone.now.serverLoadSessions();
	
	// Clear out the clocks
	clocks[sId] = null;
}

// Loads all the session for a client
everyone.now.serverLoadSessions = function() {
	var targetClient = this;
	
	console.log(this.user.clientId+' Loading Sessions');
	// Load all current sessions for the new client
	for(var sId in sessions){
		if(sessions[sId] != null && typeof(sessions[sId]) != 'function') {
			console.log("\t" + sId);
			this.now.clientAddSession(sId);
			
			// Move Devices to Session
			serverSetDevicesOffset(sId, targetClient);
		}
	}
	console.log(this.user.clientId+' Loading Completed');
}

// Adds Device to Server's Session
// Requests a removal of device from old session
// Tells all clients to move the device icon to the session
everyone.now.serverAddDeviceToSession = function(cId, sId) {
	var device = devices.findDevice(cId);
	// Ignore adding to the same session
	if(device['sId'] == sId) {
		console.log(cId+" already in this session "+sId+", so device not added.");
	}
	else {
		// Update NowJS group
		var sessionGroup = now.getGroup(sId);
		sessionGroup.addUser(cId)
	
		//check session list
		console.log('sessions[sId] (addDevice)='+sessions[sId]);

		// Remove user from old session
		this.now.serverRemoveDeviceFromSession(cId, cId, null, device['sId']);
	
		// Update Server's database
		device['sId'] = sId;
		
		// Update sId on the client side
		// Show the button
		now.getClient(cId, function() {
			this.now.clientSetSId(sId);
			this.now.clientShowWatchButton(sId);
		}); 
		
		// Reload Session-Details
		everyone.now.clientReloadSessionDetailsDeviceList(sId);
		
		console.log('Client: '+cId+' added to Session: '+sId);
	}
	// Tell all Clients to move Device Icon into session
	serverSetDevicesOffset(sId, everyone);
}

// Removes Device from a Session
// If the session becomes empty, delete it
// Updates Session Leader on the server if needed
// abortedCB is a callback with param which indicates aborted or not
everyone.now.serverRemoveDeviceFromSession = function(operatorCID, cId, abortedCB, sId) {
	var opDevice = devices.findDevice(operatorCID);
	
	var targetClient = this;
	var device = devices.findDevice(cId);
	// Device was never in a session or already removed
	if(device['sId'] == null) {
		console.log(cId+" not removed because was not in a session or already removed.");
		if(abortedCB){
			abortedCB(false);
		}
		return;
	}
	// If sId is not specified, remove device from previous session
	else if(sId == null) {
		sId = device['sId'];
	}
	
	if(!(operatorCID == cId || (device['sId'] == opDevice['sId'] && sessions[sId] == operatorCID ))){
		//should abort
		console.log('cancle REMOVE');
		if(abortedCB){
			abortedCB(true);
		}
		return;
	}
	console.log('Commit REMOVE');
	
	// Update NowJS group
	var sessionGroup = now.getGroup(sId);
	sessionGroup.removeUser(cId)
	
	// Update Server's database on what session is the device in
	device['sId'] = null;
	device['media'] = null;
	
	// Update sId on the client side
	// Update the client's media
	now.getClient(cId, function() {
		this.now.clientSetSId(null)
		this.now.clientSetMediaContent(null,null);
	}); 
	
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
				
				// Set the leader
				now.getClient(sessions[sId], function() {
					this.now.clientSetIsLeader(true);
				});
			});
		}
		
		// Reload Session-Details
		everyone.now.clientReloadSessionDetailsDeviceList(sId);
		
		// Reload Session, missing a device
		serverSetDevicesOffset(sId, everyone);
	  }
	});	
	if(abortedCB){
		abortedCB(false);
	}
}

// ------------------------------------------------ //
// ----------- DEVICE NOWJS FUNCTIONS ------------- //
// ------------------------------------------------ //

// Called from one client to move a devices to (x,y) for all devices 
// sId == Null : device List
everyone.now.serverSetDevicesOffset = function(sId, target) {
	if(target == null) {
		target = everyone;
	}
	serverSetDevicesOffset(sId, target);
}

// Helper Function
// sId == Null : device List
serverSetDevicesOffset = function(sId, target) {
	console.log('Setting offset for session: '+sId);
	var k = 0;
	for(var i = 0; i < devices.length; i++){
		if(devices[i]['sId'] == sId) {
			target.now.clientSetDeviceOffset(devices[i]['cId'], k, sId);
			k++;
		}
	}
}

// Registers Device to Server
everyone.now.serverAddDevice = function(name) {
	console.log(name+" connected");
	
	// Update Server's devices lists
	devices.push({'name':name, 'cId':this.user.clientId, 'sId':null, 'media':null,'leader':0});
	
	// Set the client's Id 
	this.now.clientSetClientId(this.user.clientId);
	
	// Update all current user's devices
	everyone.now.clientAddDevice(name, this.user.clientId);
	
	// Update Devices Offsets
	serverSetDevicesOffset(null, everyone);	
};

// Loads all the devices for a client
everyone.now.serverLoadDevices = function() {
	// Load all current devices for the new client
	for(var i = 0; i < devices.length; i++) {
		console.log("Load device: "+devices[i]['name']);
		// Don't Add Itself
		if(this.user.clientId != devices[i]['cId']) {
			this.now.clientAddDevice(devices[i]['name'], devices[i]['cId']);
		}
	}
}

// -------------------------------------------------------- //
// ----------- SESSION-PANELS NOWJS FUNCTIONS ------------- //
// -------------------------------------------------------- //

//notify client with this cId to hide the watch button of sId
everyone.now.serverHideWatchButton = function(cId, sId){
	console.log('Hiding '+cId+' watch video button for session '+sId);
	now.getClient(cId, function() {
			this.now.clientHideWatchButton(sId);
	});
}


// --------------------------------------------------------- //
// ----------- SESSION-DETAILS NOWJS FUNCTIONS ------------- //
// --------------------------------------------------------- //

// Sets the Media Device for a Client
everyone.now.serverSetDeviceMedia= function(cId, url) {
	for(var i = 0; i < devices.length; i++){
		if(devices[i]['cId'] == cId) {
			devices[i]['media'] = url;
			console.log(cId+' media set to '+url);
			break;
		}
	}
	
	// Set the specific client's url
	now.getClient(cId, function() {
		this.now.clientSetUrl(url);
	});
	
	// Tell all users to reload session details
	everyone.now.clientReloadSessionDetailsDeviceList(devices[i]['sId']);
	
	// Tell all users to update their media lists
	everyone.now.clientUpdateSelectedMedia(devices[i]['cId'], url);
}

// ------------------------------------------------- //
// ----------- CLEANUP NOWJS FUNCTIONS ------------- //
// ------------------------------------------------- //

// Client Disconnected
// Remove the Device Icon from all Clients
// Remove Device from Session (NEED TO BE FIXED, currently all clients are calling this)
// Reset Variables if no client is connected.
everyone.disconnected(function() {
	console.log(this.now.dId+" disconnected.")
	
	if(typeof(everyone.now.clientRemoveDevice) != "undefined") {
		everyone.now.serverRemoveDeviceFromSession(this.user.clientId,this.user.clientId, null, null);
		everyone.now.clientRemoveDevice(this.user.clientId);
		devices.removeDevice(this.user.clientId);
		serverSetDevicesOffset(null, everyone);
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

// ------------------------------------------ //
// ----------- ARRAY PROTOTYPES ------------- //
// ------------------------------------------ //

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