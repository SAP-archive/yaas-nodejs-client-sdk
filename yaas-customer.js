'use strict';

var pathCustomerBase = '/hybris/customer/v1/{{projectId}}/';

var Customer = function(rh) {
    
    this.requestHelper = rh;

    this.getCustomer = function(customerNumber) {
        return this.requestHelper.get(pathCustomerBase + 'customers/' + customerNumber, {});
    };

    this.getCustomers = function(queryParameters) {
        return this.requestHelper.get(pathCustomerBase + 'customers', queryParameters);
    };

    this.signup = function(credentials) {
        return this.requestHelper.post(pathCustomerBase + 'signup', 'application/json', credentials);
    };

    this.updateCustomer = function(customerNumber, customer) {
    return this.requestHelper.put(pathCustomerBase + 'customers/' + customerNumber, 'application/json', customer);
    };

    this.createCustomerAddress = function(customerNumber, address) {
        return this.requestHelper.post(
            pathCustomerBase + 'customers/' + customerNumber + '/addresses', 
            'application/json', 
            address);
    };

};

module.exports = Customer;
