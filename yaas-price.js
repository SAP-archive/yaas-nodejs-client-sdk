var pathPriceBase = '/hybris/price/v1/{{projectId}}/prices';

var Price = function(rh) {
	this.requestHelper = rh;

	this.getPrices = function(queryParameters) {
		return this.requestHelper.get(pathPriceBase, queryParameters);
	};

	this.getPricesForProducts = function(productIds, currency) {
		return this.getPrices({productId: productIds, currency: currency});
	};
};

module.exports = Price;
