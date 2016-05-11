var pathCustomerBase = '/hybris/customer/v1/{{projectId}}/customers';
var pathSignupBase = '/hybris/customer/v1/{{projectId}}/signup';

var Customer = function(rh) {
	this.requestHelper = rh;

	this.getCustomer = function(customerNumber) {
		return this.requestHelper.get(pathCustomerBase + '/' + customerNumber, {});
	};

	this.getCustomers = function(queryParameters) {
		return this.requestHelper.get(pathCustomerBase, queryParameters);
	};

  this.signup = function(credentials) {
    return this.requestHelper.post(pathSignupBase, "application/json", credentials);
  };

  this.updateCustomer = function(customerNumber, customer) {
    return this.requestHelper.put(pathCustomerBase + "/" + customerNumber,
        "application/json", customer);
  };

  this.createCustomerAddress = function(customerNumber, address) {
		return this.requestHelper.post(pathCustomerBase + '/' + customerNumber +
        "/addresses", address);
  };

};

module.exports = Customer;
