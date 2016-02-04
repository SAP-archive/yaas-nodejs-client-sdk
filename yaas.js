var RequestHelper = require('./yaas-requesthelper.js');
var CartService = require('./yaas-cart.js');
var CheckoutService = require('./yaas-checkout.js');
var CustomerService = require('./yaas-customer.js');
var OrderService = require('./yaas-order.js');
var PriceService = require('./yaas-price.js');
var ProductService = require('./yaas-product.js');
var PubSubService = require('./yaas-pubsub.js');
var SiteService = require('./yaas-site.js');

var Yaas = function() {
    this.init = function(theClientId, theClientSecret, theScope, theProjectId) {
        this.requestHelper = new RequestHelper(theClientId, theClientSecret, theScope, theProjectId);
        this.cart = new CartService(this.requestHelper);
        this.checkout = new CheckoutService(this.requestHelper);
        this.customer = new CustomerService(this.requestHelper);
        this.order = new OrderService(this.requestHelper);
        this.price = new PriceService(this.requestHelper);
        this.product = new ProductService(this.requestHelper);
        this.pubsub = new PubSubService(this.requestHelper);
        this.site = new SiteService(this.requestHelper);
        return Promise.resolve();
    };
};

module.exports = Yaas;
