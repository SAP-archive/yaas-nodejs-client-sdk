'use strict';

var RequestHelper = require('./yaas-requesthelper.js');
var CartService = require('./yaas-cart.js');
var CheckoutService = require('./yaas-checkout.js');
var CustomerService = require('./yaas-customer.js');
var OrderService = require('./yaas-order.js');
var PriceService = require('./yaas-price.js');
var ProductService = require('./yaas-product.js');
var PubSubService = require('./yaas-pubsub.js');
var SiteService = require('./yaas-site.js');
var DocumentService = require('./yaas-document.js');
var CouponService = require('./yaas-coupon.js');
var LoyaltyConfigurationService = require('./yaas-loyalty-configuration.js');
var LoyaltyMemberService = require('./yaas-loyalty-member.js');

var Yaas = function() {
    this.init = function(theClientId, theClientSecret, theScope, theProjectId, yaasExtensions, overrideApiUrl) {
        this.requestHelper = new RequestHelper(theClientId, theClientSecret, theScope, theProjectId, overrideApiUrl);
        this.requestHelper.setDebug(this.debugCallback);
        this.cart = new CartService(this.requestHelper);
        this.checkout = new CheckoutService(this.requestHelper);
        this.customer = new CustomerService(this.requestHelper);
        this.order = new OrderService(this.requestHelper);
        this.price = new PriceService(this.requestHelper);
        this.product = new ProductService(this.requestHelper);
        this.pubsub = new PubSubService(this.requestHelper);
        this.site = new SiteService(this.requestHelper);
        this.document = new DocumentService(this.requestHelper);
        this.coupon = new CouponService(this.requestHelper);
        this.loyaltyConfiguration = new LoyaltyConfigurationService(this.requestHelper);
        this.loyaltyMember = new LoyaltyMemberService(this.requestHelper);

        if (yaasExtensions) {
          yaasExtensions.forEach(function(extension) {
            var Service = require(extension.path);
            this[extension.serviceName] = new Service(this.requestHelper);
            Service = undefined;
          }.bind(this));
        }

        return Promise.resolve(this);
    };

    this.setDebugCallback = function(callback) {
        this.debugCallback = callback;
    };
};

module.exports = Yaas;
