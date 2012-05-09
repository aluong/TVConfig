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

everyone.now.loaded = function(name) {
	console.log(name+" connected");
	
	// Update Server's devices lists
	devices[name] = true
	
	// Update all current user's devices
	everyone.now.addDevice(name);
	
	// Load all current devices
	for(var device in devices) {
		if(devices[device]) {
			console.log("device: "+device);
			this.now.addDevice(device);
		}
	}
};

everyone.disconnected(function() {
	console.log(this.now.name+" disconnected")
	
	if(typeof(everyone.now.removeDevice) != "undefined") {
		everyone.now.removeDevice(this.now.name);
		devices[this.now.name] = false;
	}
}) 
