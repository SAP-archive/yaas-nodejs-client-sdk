var https = require('https');
var querystring = require('querystring');

var yaasHost = 'api.yaas.io';
var pathToken = '/hybris/oauth2/b1/token';
var pathCartBase;
var pathCheckout;
var pathCustomerBase;
var pathOrderBase = '/hybris/order/b1';
var pathPriceBase;
var pathProductBase;
var pathPubSubBase = '/hybris/pubsub/b2/topics';
var pathSalesorderBase;
var pathSiteBase;

var debug = false;
var verbose = false;
var clientId, clientSecret, projectId, scope;
var accessToken;

exports.init = function (theClientId, theClientSecret, theScope) {
	return new Promise(function (resolve, reject) {
		if (!theClientId || !theClientSecret || !theScope) {
			reject(new Error("Client ID, Client Secret and Scope have to be set!"));
		} else {
			clientId = theClientId;
			clientSecret = theClientSecret;
			scope = theScope;
			resolve();
		}
	}).then(getToken);
};

exports.setProjectId = function (value) {
	projectId = value;

	pathCartBase = '/hybris/cart/b1/' + projectId + '/carts';
	pathCheckout = '/hybris/checkout/b1/' + projectId + '/checkouts/order';
	pathCustomerBase = '/hybris/customer/b1/' + projectId + '/customers';
	pathPriceBase = '/hybris/price/b1/' + projectId + '/prices';
	pathProductBase = '/hybris/product/b1/' + projectId + '/products';
	pathOrderBase = '/hybris/order/b1/' + projectId;
	pathSiteBase = '/hybris/site/b1/' + projectId + '/sites';
}

exports.setDebug = function (state) {
	debug = state;
}

exports.setVerbose = function (state) {
	verbose = state;
}

function getToken() {
	return sendPostRequest(
		pathToken,
		'application/x-www-form-urlencoded',
		querystring.stringify({
			'grant_type' : 'client_credentials',
			'scope' : scope,
			'client_id' : clientId,
			'client_secret' : clientSecret
		})
	).then(function (response) {
		if (response.statusCode == 200) {
			accessToken = response.body.access_token;
			if (debug) {
				console.log('Received access token: ' + accessToken);
				console.log("Granted scopes: " + response.body.scope);
			}
			return Promise.resolve();
		} else {
			console.error("Could not obtain token!");
			console.error(JSON.stringify(response.body));
			return Promise.reject();
		}
	});
}

function sendRequest(method, path, mime, data) {
	return new Promise(function (resolve, reject) {
		var headers = {};
		
		if (mime != null) {
			headers['Content-Type'] = mime;
		}
	
		if (accessToken != null) {
			headers['Authorization'] = 'Bearer ' + accessToken;
		}
	
		var options = {
			hostname: yaasHost,
			port: 443,
			path: path,
			method: method,
			headers: headers
		};
		
		if (debug) {console.log("Sending request to", yaasHost + path);}
	
		var req = https.request(options, function (res) {
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
				
				resolve({statusCode: res.statusCode, headers: res.headers, body: data});
			});
		});
	
		req.on('error', function(e) {
			reject('problem with request: ' + e.message);
		});

		if (data && (method == 'POST' || method == 'PUT')) {
			if (debug) {
				console.log('Sending data: ' + data);
			}
			req.write(data);
		}
		req.end();
	})
	.then(function (response) {
		// Check for authorization errors
		if (response.statusCode == 401) {
			console.log("Unauthorized, trying to get new token...");
			accessToken = null;
			return getToken().then(function () {
				console.log("Retrying request...");
				return sendRequest(method, path, mime, data);
			});
		} else {
			return Promise.resolve(response)
			.then(processResponseBody)
			.then(checkForServerError);
		}
	});
}

function processResponseBody(response) {
	return new Promise(function(resolve, reject) {
		var responseMime;
		if (response.headers['content-type']) {
			responseMime = response.headers['content-type'].split(';')[0];
		}

		var responseBody;
		switch (responseMime) {
			case 'text/plain':
				responseBody = response.body;
				break;
			case 'application/json':
				try {
					responseBody = JSON.parse(response.body);
				} catch (e) {
					reject('Could not read server response: ' + e.message);
				}
				break;
			default:
				responseBody = response.body;
		}
		
		resolve({statusCode: response.statusCode, body: responseBody});
	});
}

function checkForServerError(response) {
	return new Promise(function (resolve, reject) {
		if (response.statusCode >= 500) {
			var errorMessage;
			if (response.body.message) {
				errorMessage = response.body.message;
			} else if (response.body.type) {
				errorMessage = response.body.type;
			} else {
				errorMessage = "HTTP error " + response.statusCode;
			}
			reject(new Error(errorMessage));
		} else {
			resolve(response);
		}
	});
}

function sendGetRequest(path, params) {
	var pathWithParams = path + (params.length > 0 ? '?' + querystring.stringify(params) : '');
	return sendRequest('GET', pathWithParams, null, {});
}

function sendPostRequest(path, mime, postData) {
	return sendRequest('POST', path, mime, postData);
}

/**
 * Convert PubSub event payloads into proper nested JSON
 */
function fixEventPayload(events) {
	return new Promise(function (resolve, reject) {
		events.forEach(function(event) {
			try {
				event.payload = JSON.parse(event.payload);
			} catch (e) {
				console.log("Could not parse payload");
				return reject(new Error("Could not parse payload: " + e.message));
			}
		});
		resolve();
	});
}

exports.commitEvents = function (topicOwnerClient, eventType, token) {
	if (verbose) {console.log("Committing events...");}
	
	return sendPostRequest(
		pathPubSubBase + '/' + topicOwnerClient + '/' + eventType + '/commit',
		'application/json',
		JSON.stringify({
			"token": token
		})
	).then(function (response) {
		if (response.statusCode == 200) {
			if (verbose) {
				console.log("Event(s) committed");
			}
			return Promise.resolve();
		} else {
			var errorMessage = "Problem: " + JSON.stringify(response.body);
			if (debug) {
				console.log(errorMessage);
			}
			return Promise.reject(new Error(errorMessage));
		}
	});
}

exports.readPubSub = function (topicOwnerClient, eventType, numEvents) {
	return sendPostRequest(
		pathPubSubBase + '/' + topicOwnerClient + '/' + eventType + '/read',
		'application/json',
		JSON.stringify({
			"numEvents": numEvents,
			"ttlMs": 4000,
			"autoCommit": false
		})
	).then(function (response) {
		if (response.statusCode == 204) {
			if (verbose) {
				console.log("No events available");
			}
			return Promise.resolve();
		} else if (response.statusCode == 200) {
			return fixEventPayload(response.body.events).then(function() {
				return Promise.resolve(response.body);
			});
		} else {
			if (debug) {
				console.log("Problem: " + JSON.stringify(response.body));
			}
			return Promise.reject(new Error("Problem with request: " + JSON.stringify(response.body)));
		}
	});
}

exports.getSalesorderDetails = function (orderId) {
	if (verbose) {console.log("Getting salesorder details for order %s...", orderId);}
	return sendGetRequest(pathOrderBase + '/salesorders/' + orderId, {}).then(function (response) {
		if (response.statusCode == 200) {
			return Promise.resolve(response.body);
		} else {
			var errorMessage = "Problem: " + JSON.stringify(response.body);
			if (debug) {
				console.log(errorMessage);
			}
			return Promise.reject(new Error(errorMessage));
		}
	});
}

