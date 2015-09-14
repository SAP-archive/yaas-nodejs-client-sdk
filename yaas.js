var https = require('https');
var querystring = require('querystring');

var yaasHost = 'api.yaas.io';
var pathToken = '/hybris/oauth2/b1/token';
var pathPubSubBase = '/hybris/pubsub/b2/topics';
var pathOrderBase = '/hybris/order/b1';

var debug = false;
var verbose = false;
var clientId, clientSecret, scope;
var accessToken;

exports.init = function (cid, cs, sc) {
	clientId = cid;
	clientSecret = cs;
	scope = sc;
}

exports.setDebug = function (state) {
	debug = state;
}

exports.setVerbose = function (state) {
	verbose = state;
}

exports.getToken = function (callback) {
	sendPostRequest(
		pathToken,
		'application/x-www-form-urlencoded',
		querystring.stringify({
			'grant_type' : 'client_credentials',
			'scope' : scope,
			'client_id' : clientId,
			'client_secret' : clientSecret
		}),
		function(statusCode, responseBody) {
			if (statusCode == 200) {
				accessToken = responseBody.access_token;
				if (debug) {
					console.log('Received access token: ' + accessToken);
					console.log("Granted scopes: " + responseBody.scope);
				}
				callback();
			} else {
				console.log("Could not obtain token!");
				console.log(JSON.stringify(responseBody));
			}
		}
	);
}

function sendPostRequest(path, mime, postData, callback) {
	if (debug) {
		console.log('Sending POST data: ' + postData);
	}
	
	var headers = {
		'Content-Type': mime
	};
	
	if (accessToken != null) {
		headers['Authorization'] = 'Bearer ' + accessToken;
	}
	
	var options = {
		hostname: yaasHost,
		port: 443,
		path: path,
		method: 'POST',
		headers: headers
	};
	
	var req = https.request(options, onResponse.bind({callback : callback}));
	
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	// write data to request body
	req.write(postData);
	req.end();
}

function onResponse(res) {
	res.setEncoding('utf8');
	var data = "";

	res.on('data', function (chunk) {
		data += chunk;
	});

	res.on('end', function() {
		if (debug) {
			console.log('Status code: ' + res.statusCode);
			console.log('Headers: ' + JSON.stringify(res.headers));
			console.log('Body: ' + data);
		}
		
		if (res.statusCode == 401) {
			// TODO reauthenticate
			console.log("!!!UNAUTHORIZED!!!");
			sendSerial("DO_ERROR");
			return;
		}
		
		var responseBody;
		try {
			responseBody = (data.length == 0 ? {} : JSON.parse(data));
		} catch (e) {
			console.log('Could not read answer!');
			if (e instanceof Error) {
				console.log('Error: ' + e.message);
			}
			return;
		}
		
		this.callback(res.statusCode, responseBody);
	}.bind({callback : this.callback}));
}

exports.checkForOrderStatusChange = function (callback) {
	if (verbose) {console.log("Checking for order status changes...");}
	sendPostRequest(
		pathPubSubBase + '/hybris.order/order-status-changed/read',
		'application/json',
		JSON.stringify({
			"numEvents": 1,
			"autoCommit": false
		}),
		function(statusCode, responseBody) {
			if (statusCode == 204) {
				if (verbose) {
					console.log("No events available");
				}
				callback();
			} else if (statusCode == 200) {
				var events = responseBody.events;
				events.forEach(function(event) {
					if (debug) {
						console.log("Processing event: %s", JSON.stringify(event));
					}
					
					if (event.eventType != "order-status-changed") {
						console.log("Wrong event type: %s!", event.eventType);
						return;
					}
					
					var payload;
					try {
						payload = JSON.parse(event.payload);
					} catch (e) {
						console.log("Could not parse payload");
						callback(new Error("Could not parse payload: " + e.message));
						return;
					}
					callback(null, payload, responseBody.token);
				});
			} else {
				if (debug) {
					console.log("Problem: " + JSON.stringify(responseBody));
				}
				callback(new Error("Problem with request: " + JSON.stringify(responseBody)));
			}
		}
	);
}

exports.commitEvents = function (token, callback) {
	if (verbose) {console.log("Committing events...");}
	
	sendPostRequest(
		pathPubSubBase + '/hybris.order/order-status-changed/commit',
		'application/json',
		JSON.stringify({
			"token": token
		}),
		function(statusCode, responseBody) {
			if (statusCode == 200) {
				if (verbose) {
					console.log("Event(s) committed");
				}
				callback();
			} else {
				if (debug) {
					console.log("Problem: " + JSON.stringify(responseBody));
				}
				callback(new Error("Problem: " + JSON.stringify(responseBody)));
			}
		}
	);
}