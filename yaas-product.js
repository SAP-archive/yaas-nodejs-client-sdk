var requestHelper;
var pathProductBase;

function init(rh, projectId) {
	requestHelper = rh;
	pathProductBase = '/hybris/product/b1/' + projectId + '/products';
}

function getProduct(productId, fields) {
	queryParameters = (fields ? {fields: fields} : {});
	return requestHelper.get(pathProductBase + '/' + productId, queryParameters);
}

module.exports = {
	getProduct: getProduct,
	init: init
};