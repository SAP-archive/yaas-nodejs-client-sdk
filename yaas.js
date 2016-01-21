var requestHelper = require('./yaas-requesthelper.js');
var cart = require('./yaas-cart.js');
var checkout = require('./yaas-checkout.js');
var customer = require('./yaas-customer.js');
var order = require('./yaas-order.js');
var price = require('./yaas-price.js');
var product = require('./yaas-product.js');
var pubsub = require('./yaas-pubsub.js');
var site = require('./yaas-site.js');

function init(theClientId, theClientSecret, theScope, theProjectId) {
	return requestHelper.begin(theClientId, theClientSecret, theScope, theProjectId).then(function() {
		cart.init(requestHelper);
		checkout.init(requestHelper);
		customer.init(requestHelper);
		order.init(requestHelper);
		price.init(requestHelper);
		product.init(requestHelper);
		pubsub.init(requestHelper);
		site.init(requestHelper);
		return Promise.resolve();
	});
}

function setDebug(state) {
	requestHelper.setDebug(state);
}

function setVerbose(state) {
	requestHelper.setVerbose(state);
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
	site: site,
	deleteRequest: requestHelper.delete,
	getRequest: requestHelper.get,
	postRequest: requestHelper.post,
	putRequest: requestHelper.put
};