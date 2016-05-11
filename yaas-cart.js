var pathCartBase = '/hybris/cart/v1/{{projectId}}/carts';

var Cart = function(rh) {
	this.requestHelper = rh;

	this.create = function(customerNumber, currency, siteCode) {
		return this.requestHelper.post(
			pathCartBase,
			'application/json',
			{
				customerId : customerNumber,
				currency : currency,
				siteCode : siteCode
			}
		);
	};

	this.deleteCart = function(cartId) {
		return this.requestHelper.delete(pathCartBase + '/' + cartId);
	};

	this.getByCriteria = function(queryParameters) {
		return this.requestHelper.get(pathCartBase, queryParameters);
	};

	this.addProduct = function(cartId, product, quantity, price) {
		return this.requestHelper.post(
			pathCartBase + '/' + cartId + '/items',
			'application/json',
			{
				price: price,
				quantity: quantity,
				product: product
			}
		);
	};

  this.addDiscount = function(cartId, coupon) {
    return this.requestHelper.post(
      pathCartBase + '/' + cartId + "/discounts",
      'application/json',
      coupon
    );
  };
	
	this.clearCart = function(cartId) {
		return this.requestHelper.delete(pathCartBase + '/' + cartId + '/items');
	};
};

module.exports = Cart;
