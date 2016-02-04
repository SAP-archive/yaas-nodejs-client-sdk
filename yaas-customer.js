var pathCustomerBase = '/hybris/customer/v1/{{projectId}}/customers';;

var Customer = function(rh) {
	this.requestHelper = rh;

	this.getCustomer = function(customerNumber) {
		return this.requestHelper.get(pathCustomerBase + '/' + customerNumber, {});
	};

	this.getCustomers = function(queryParameters) {
		return this.requestHelper.get(pathCustomerBase, queryParameters);
	};
};

module.exports = Customer;
