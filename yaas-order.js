var pathOrderBase;
var requestHelper;

function init(rh, projectId) {
	requestHelper = rh;
	pathOrderBase = '/hybris/order/b1/' + projectId;
}

function getSalesorderDetails(orderId) {
	return requestHelper.get(pathOrderBase + '/salesorders/' + orderId, {}).then(function (response) {
		if (response.statusCode == 200) {
			return Promise.resolve(response.body);
		} else {
			return Promise.reject(new Error("Problem: " + JSON.stringify(response.body)));
		}
	});
}

module.exports = {
	getSalesorder: getSalesorderDetails,
	init: init
};