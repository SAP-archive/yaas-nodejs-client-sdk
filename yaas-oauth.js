var pathToken = '/hybris/oauth2/v1/token';

var requestHelper;
var clientId, clientSecret, scope;

function begin(rh, theClientId, theClientSecret, theScope) {
	requestHelper = rh;
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
}

function getToken() {
	return requestHelper.post(
		pathToken,
		'application/x-www-form-urlencoded',
		{
			'grant_type' : 'client_credentials',
			'scope' : scope,
			'client_id' : clientId,
			'client_secret' : clientSecret
		}
	).then(function (response) {
		if (response.statusCode == 200) {
			return Promise.resolve(response.body);
		} else {
			return Promise.reject(new Error("Could not obtain token!" + JSON.stringify(response.body)));
		}
	});
}

module.exports = {
	begin: begin,
	getToken: getToken
};