var pathCheckout = '/hybris/checkout/v1/{{projectId}}/checkouts';

var Checkout = function(rh) {
	this.requestHelper = rh;

	this.checkout = function(data) {
		return this.requestHelper.post(pathCheckout + '/order', 'application/json', data);
	};

	this.get = function(checkoutId) {
		return this.requestHelper.get(pathCheckout + '/' + checkoutId, {});
	};
};

module.exports = Checkout;
