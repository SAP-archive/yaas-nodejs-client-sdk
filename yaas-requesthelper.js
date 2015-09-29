var https = require('https');
var querystring = require('querystring');
var yaasOauth = require('./yaas-oauth.js');

/* Constants */
var yaasHost = 'api.yaas.io';

/* Variables */
var accessToken;
var grantedScope;

function begin(theClientId, theClientSecret, theScope) {
	return yaasOauth.begin(this, theClientId, theClientSecret, theScope).then(function(response) {
		accessToken = response.access_token;
		grantedScope = response.scope;
	});
};

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

function prepareData(data, mime) {
	switch (mime) {
		case 'application/x-www-form-urlencoded':
			return querystring.stringify(data);
		case 'application/json':
			return JSON.stringify(data);
		default:
			return data;
	}
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

function sendDeleteRequest(path) {
	return sendRequest('DELETE', path, null, {});
}

function sendGetRequest(path, params) {
	var pathWithParams = path + (params.length > 0 ? '?' + querystring.stringify(params) : '');
	return sendRequest('GET', pathWithParams, null, {});
}

function sendPostRequest(path, mime, postData) {
	return sendRequest('POST', path, mime, prepareData(postData, mime));
}

function sendPutRequest(path, mime, putData) {
	return sendRequest('PUT', path, mime, prepareData(putData, mime));
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
	
		var req = https.request(options, function (res) {
			res.setEncoding('utf8');
			var data = "";

			res.on('data', function (chunk) {
				data += chunk;
			});

			res.on('end', function() {
				resolve({statusCode: res.statusCode, headers: res.headers, body: data});
			});
		});
	
		req.on('error', function(e) {
			reject('problem with request: ' + e.message);
		});

		if (data && (method == 'POST' || method == 'PUT')) {
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

function unexpectedResponseCode(statusCode) {
	return Promise.reject(new Error("Unexpected HTTP status code " + statusCode));
}

module.exports = {
	begin: begin,
	delete: sendDeleteRequest,
	get: sendGetRequest,
	post: sendPostRequest,
	put: sendPutRequest
};