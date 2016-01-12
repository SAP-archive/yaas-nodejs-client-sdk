var requestHelper;
var pathCustomerBase = '/hybris/customer/v1/{{projectId}}/customers';;

function init(rh) {
	requestHelper = rh;
}

function getCustomer(customerNumber) {
	return requestHelper.get(pathCustomerBase + '/' + customerNumber, {});
}

function getCustomers(queryParameters) {
	return requestHelper.get(pathCustomerBase, queryParameters);
}

module.exports = {
	getCustomer: getCustomer,
	getCustomers: getCustomers,
	init: init
};