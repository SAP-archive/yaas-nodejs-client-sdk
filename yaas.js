var requestHelper = require('./yaas-requesthelper.js');
var order = require('./yaas-order.js');
var pubsub = require('./yaas-pubsub.js');

var pathCartBase;
var pathCheckout;
var pathCustomerBase;
var pathPriceBase;
var pathProductBase;
var pathSiteBase;

var debug = false;
var verbose = false;

function init(theClientId, theClientSecret, theScope, theProjectId) {
	return requestHelper.begin(theClientId, theClientSecret, theScope).then(function() {
		order.init(requestHelper, theProjectId);
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

module.exports = {
	init: init,
	order: order,
	pubsub: pubsub,
	setDebug: setDebug,
	setProjectId: setProjectId,
	setVerbose: setVerbose
};