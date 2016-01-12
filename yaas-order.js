var pathOrderBase = '/hybris/order/v1/{{projectId}}';
var pathSalesorderBase = pathOrderBase + '/salesorders';
var requestHelper;

function init(rh) {
	requestHelper = rh;
}

function addShipmentToSalesorder(orderId, data) {
	return requestHelper.put(
		pathSalesorderBase + '/' + orderId,
		'application/json',
		data
	);
}

function getSalesorderDetails(orderId) {
	return requestHelper.get(pathSalesorderBase + '/' + orderId, {});
}

function transitionSalesorder(orderId, newState) {
	return requestHelper.post(
		pathSalesorderBase + '/' + orderId + '/transitions',
		'application/json',
		{
			status: newState
		}
	);
}

module.exports = {
	addShipmentToSalesorder: addShipmentToSalesorder,
	getSalesorder: getSalesorderDetails,
	init: init,
	transitionSalesorder: transitionSalesorder
};