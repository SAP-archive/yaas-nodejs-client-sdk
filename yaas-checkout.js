var requestHelper;
var pathCheckout = '/hybris/checkout/v1/{{projectId}}/checkouts';

function init(rh) {
	requestHelper = rh;
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
