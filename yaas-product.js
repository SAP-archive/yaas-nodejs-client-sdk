var pathProductBase = '/hybris/product/v1/{{projectId}}/products';

var Product = function(rh) {
	this.requestHelper = rh;

	this.getProduct = function(productId, fields) {
		var queryParameters = (fields ? {fields: fields} : {});
		return this.requestHelper.get(pathProductBase + '/' + productId, queryParameters);
	};
};

module.exports = Product;
