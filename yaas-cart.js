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
	return requestHelper.delete(pathCartBase + '/' + cartId);
}

function getByCriteria(queryParameters) {
	return requestHelper.get(pathCartBase, queryParameters);
}

function addProduct(cartId, product, quantity, price) {
	return requestHelper.post(
		 pathCartBase + '/' + cartId + '/items',
		'application/json',
		{
			price: price,
			quantity: quantity,
			product: product
		}
	);
}

module.exports = {
	addProduct: addProduct,
	create: create,
	delete: deleteCart,
	getByCriteria: getByCriteria,
	init: init
};