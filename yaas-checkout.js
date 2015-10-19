var requestHelper;
var pathCheckout;

function init(rh, projectId) {
	requestHelper = rh;
	pathCheckout = '/hybris/checkout/b1/' + projectId + '/checkouts';
}

function checkout(data) {
	return requestHelper.post(pathCheckout + '/order', 'application/json', data);
}

function get(checkoutId) {
	return requestHelper.get(pathCheckout + '/' + checkoutId, {});
}

module.exports = {
	checkout: checkout,
	get: get,
	init: init
};