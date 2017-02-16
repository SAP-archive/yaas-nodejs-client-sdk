'use strict';

var pathProductBase = '/hybris/product/v2/{{projectId}}/products';

var Product = function(rh) {
	this.requestHelper = rh;

	this.getProduct = function(productId, fields, variants) {
		var queryParameters = (fields ? {fields: fields} : {});
                var path = pathProductBase + '/' + productId;
                if (variants) {
                    path += '/variants';
                }
		return this.requestHelper.get(path, queryParameters);
	};

	function checkParameters(queryParameters) {
		var qp = {};
		qp.q = queryParameters.q;
		
		if (qp.sort) {
			qp.sort = queryParameters.sort;
		}
		if (qp.pageNumber) {
			qp.pageNumber = queryParameters.pageNumber;
		}
		if (qp.pageSize) {
			qp.pageSize = queryParameters.pageSize;
		}
		if (qp.effectiveDate) {
			qp.effectiveDate = queryParameters.effectiveDate;
		}
		
		return qp;
	}

	this.getProducts = function(queryParameters) {
		
		var qp = checkParameters(queryParameters);

		var q = [];
		if (queryParameters) {
			if (queryParameters.q) {
				for (var key in queryParameters.q) {
					if (queryParameters.q.hasOwnProperty(key)) {
						q.push(key + ':' + queryParameters.q[key]);
					}
				}
			}
			qp.q = q.join(' ');
		}
		return this.requestHelper.get(pathProductBase, qp);
	};

        this.updateProduct = function(product) {
		return this.requestHelper.put(pathProductBase + '/' + product.id, 'application/json', product);
        };
};

module.exports = Product;
