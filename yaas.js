var RequestHelper = require('./yaas-requesthelper.js');
var cart = require('./yaas-cart.js');
var checkout = require('./yaas-checkout.js');
var customer = require('./yaas-customer.js');
var order = require('./yaas-order.js');
var price = require('./yaas-price.js');
var product = require('./yaas-product.js');
var pubsub = require('./yaas-pubsub.js');
var site = require('./yaas-site.js');
var requestHelper;

function init(theClientId, theClientSecret, theScope, theProjectId) {
  requestHelper = new RequestHelper(theClientId, theClientSecret, theScope, theProjectId);
	cart.init(requestHelper);
	checkout.init(requestHelper);
	customer.init(requestHelper);
	order.init(requestHelper);
	price.init(requestHelper);
	product.init(requestHelper);
	pubsub.init(requestHelper);
	site.init(requestHelper);
	return Promise.resolve();
}

function setDebug(state) {
	requestHelper.setDebug(state);
}

function setVerbose(state) {
//	requestHelper.setVerbose(state);
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
