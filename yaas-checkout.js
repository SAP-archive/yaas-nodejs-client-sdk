var requestHelper;
var pathCheckout;

function init(rh, projectId) {
	requestHelper = rh;
	pathCheckout = '/hybris/checkout/b1/' + projectId + '/checkouts/order';
}

function checkout(data) {
	return requestHelper.post(pathCheckout, 'application/json', data);
}

module.exports = {
	checkout: checkout,
	init: init
};