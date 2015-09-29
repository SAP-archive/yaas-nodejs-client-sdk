var requestHelper = require('./yaas-requesthelper.js');
var pubsub = require('./yaas-pubsub.js');

var pathCartBase;
var pathCheckout;
var pathCustomerBase;
var pathOrderBase = '/hybris/order/b1';
var pathPriceBase;
var pathProductBase;
var pathSalesorderBase;
var pathSiteBase;

var debug = false;
var verbose = false;

function init(theClientId, theClientSecret, theScope) {
	return requestHelper.begin(theClientId, theClientSecret, theScope).then(function() {
		pubsub.init(requestHelper);
	});
};

function setProjectId(value) {
	projectId = value;

	pathCartBase = '/hybris/cart/b1/' + projectId + '/carts';
	pathCheckout = '/hybris/checkout/b1/' + projectId + '/checkouts/order';
	pathCustomerBase = '/hybris/customer/b1/' + projectId + '/customers';
	pathPriceBase = '/hybris/price/b1/' + projectId + '/prices';
	pathProductBase = '/hybris/product/b1/' + projectId + '/products';
	pathOrderBase = '/hybris/order/b1/' + projectId;
	pathSiteBase = '/hybris/site/b1/' + projectId + '/sites';
}

function setDebug(state) {
	debug = state;
}

function setVerbose(state) {
	verbose = state;
}

function notYetImplemented() {
	return Promise.reject(new Error("Method not yet implemented!"));
}

function getSalesorderDetails(orderId) {
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

module.exports = {
	commitEvents: pubsub.commit,
	getSalesorderDetails: getSalesorderDetails,
	init: init,
	readPubSub: pubsub.read,
	setDebug: setDebug,
	setProjectId: setProjectId,
	setVerbose: setVerbose
};