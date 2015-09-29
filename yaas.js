var requestHelper = require('./yaas-requesthelper.js');

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

exports.init = function (theClientId, theClientSecret, theScope) {
	return requestHelper.begin(theClientId, theClientSecret, theScope);
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
	
	return requestHelper.post(
		pathPubSubBase + '/' + topicOwnerClient + '/' + eventType + '/commit',
		'application/json',
		{
			token: token
		}
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
	return requestHelper.post(
		pathPubSubBase + '/' + topicOwnerClient + '/' + eventType + '/read',
		'application/json',
		{
			numEvents: numEvents,
			ttlMs: 4000,
			autoCommit: false
		}
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
	return requestHelper.get(pathOrderBase + '/salesorders/' + orderId, {}).then(function (response) {
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
