var requestHelper = require('./yaas-requesthelper.js');
var cart = require('./yaas-cart.js');
var checkout = require('./yaas-checkout.js');
var customer = require('./yaas-customer.js');
var order = require('./yaas-order.js');
var price = require('./yaas-price.js');
var product = require('./yaas-product.js');
var pubsub = require('./yaas-pubsub.js');
var site = require('./yaas-site.js');

var debug = false;
var verbose = false;

function init(theClientId, theClientSecret, theScope, theProjectId) {
	return requestHelper.begin(theClientId, theClientSecret, theScope).then(function() {
		cart.init(requestHelper, theProjectId);
		checkout.init(requestHelper, theProjectId);
		customer.init(requestHelper, theProjectId);
		order.init(requestHelper, theProjectId);
		price.init(requestHelper, theProjectId);
		product.init(requestHelper, theProjectId);
		pubsub.init(requestHelper);
		site.init(requestHelper, theProjectId);
		return Promise.resolve();
	});
};

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
	cart: cart,
	checkout: checkout,
	customer: customer,
	init: init,
	order: order,
	price: price,
	product: product,
	pubsub: pubsub,
	setDebug: setDebug,
	setVerbose: setVerbose,
	site: site
};