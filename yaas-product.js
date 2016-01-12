var requestHelper;
var pathProductBase = '/hybris/product/v1/{{projectId}}/products';

function init(rh) {
	requestHelper = rh;
}

function getProduct(productId, fields) {
	queryParameters = (fields ? {fields: fields} : {});
	return requestHelper.get(pathProductBase + '/' + productId, queryParameters);
}

module.exports = {
	getProduct: getProduct,
	init: init
};