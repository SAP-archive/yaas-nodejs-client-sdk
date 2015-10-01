var pathOrderBase;
var requestHelper;

function init(rh, projectId) {
	requestHelper = rh;
	pathOrderBase = '/hybris/order/b1/' + projectId;
}

function getSalesorderDetails(orderId) {
	return requestHelper.get(pathOrderBase + '/salesorders/' + orderId, {});
}

module.exports = {
	getSalesorder: getSalesorderDetails,
	init: init
};