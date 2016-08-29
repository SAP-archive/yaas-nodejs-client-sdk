'use strict';

var pathProductBase = '/hybris/product/v1/{{projectId}}/products';

var Product = function(rh) {
	this.requestHelper = rh;

	this.getProduct = function(productId, fields) {
		var queryParameters = (fields ? {fields: fields} : {});
		return this.requestHelper.get(pathProductBase + '/' + productId, queryParameters);
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

};

module.exports = Product;
