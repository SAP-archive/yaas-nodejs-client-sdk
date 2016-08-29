'use strict';

var pathOrderBase = '/hybris/order/v1/{{projectId}}';
var pathSalesorderBase = pathOrderBase + '/salesorders';

var Order = function(rh) {
	this.requestHelper = rh;

    this.addShipmentToSalesorder = function(orderId, data) {
        return this.requestHelper.put(
            pathSalesorderBase + '/' + orderId,
            'application/json',
            data
        );
    };

    this.getSalesorderDetails = function(orderId) {
        return this.requestHelper.get(pathSalesorderBase + '/' + orderId, {});
    };

    this.transitionSalesorder = function(orderId, newState) {
        return this.requestHelper.post(
            pathSalesorderBase + '/' + orderId + '/transitions',
            'application/json',
            {
                status: newState
            }
        );
    };
};

module.exports = Order;
