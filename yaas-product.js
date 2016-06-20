var pathProductBase = '/hybris/product/v1/{{projectId}}/products';

var Product = function(rh) {
	this.requestHelper = rh;

	this.getProduct = function(productId, fields) {
		var queryParameters = (fields ? {fields: fields} : {});
		return this.requestHelper.get(pathProductBase + '/' + productId, queryParameters);
	};

	this.getProducts = function(queryParameters) {
		var q = [];
		if (queryParameters) {
			if (queryParameters['q']) {
				for (key in queryParameters['q']) {
					if (queryParameters.q.hasOwnProperty(key)) {
						q.push(key + ":" + queryParameters['q'][key]);
					}
				}
			}
			queryParameters['q'] = q.join(" ");
		}

		return this.requestHelper.get(pathProductBase, queryParameters);
	};

};

module.exports = Product;
