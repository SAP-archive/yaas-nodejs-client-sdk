var requestHelper;
var pathPriceBase;

function init(rh, projectId) {
	requestHelper = rh;
	pathPriceBase = '/hybris/price/v1/' + projectId + '/prices';
}

function getPrices(queryParameters) {
	return requestHelper.get(pathPriceBase, queryParameters);
}

function getPricesForProducts(productIds, currency) {
	return getPrices({productId: productIds, currency: currency});
}

module.exports = {
	getPricesForProducts: getPricesForProducts,
	init: init
};