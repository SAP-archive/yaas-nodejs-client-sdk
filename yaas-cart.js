var requestHelper;
var pathCartBase;

function init(rh, projectId) {
	requestHelper = rh;
	pathCartBase = '/hybris/cart/b1/' + projectId + '/carts';
}

function create(customerNumber, currency, siteCode) {
	return requestHelper.post(
		pathCartBase,
		'application/json',
		{
			customerId : customerNumber,
			currency : currency,
			siteCode : siteCode
		}
	);
}

function deleteCart(cartId) {
	return sendDeleteRequest(pathCartBase + '/' + cartId);
}

function getByCriteria(queryParameters) {
	return requestHelper.get(pathCartBase, queryParameters);
}

module.exports = {
	create: create,
	delete: deleteCart,
	getByCriteria: getByCriteria,
	init: init
};