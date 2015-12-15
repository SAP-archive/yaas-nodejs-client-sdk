var requestHelper;
var pathCustomerBase;

function init(rh, projectId) {
	requestHelper = rh;
	pathCustomerBase = '/hybris/customer/v1/' + projectId + '/customers';
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