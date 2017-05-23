// Note: to run this example you have to install the stripe package
//       npm install stripe
//

// need more logging?
var VERBOSE = 0;

// use require to load our configuration from test-config.json
var config = require('./test-config.json');

// define the scopes here
var scopes = "hybris.customer_read hybris.cart_manage";

// require our sdk
var YaaS = require('../yaas.js');

// create a new instance
var yaas = new YaaS();

// and fill it with credentials, scopes and tenant
yaas.init(config.credentials.clientId, config.credentials.clientSecret,
    scopes,
    config.tenant);

// some global variables for the payment, which are filled
var cartId;
var customer;
var addresses;

// now, we start the request
// we use Promise for that - they enable us to do some easy-to-read functional programming

// first we have to find the customer by his email address,
// to find his cart
yaas.customer.getCustomers({ q: 'contactEmail:"' + config.emailaddress + '"', expand: 'addresses' })
    .then(response => {

        if (VERBOSE >= 1) console.log('getCustomer response:', response);

        customer = response.body[0];
        customer.email = config.emailaddress;

        addresses = [
            Object.assign({},
                customer.addresses[0]),
            customer.addresses.length > 1 ?
                Object.assign({}, customer.addresses[1]) :
                Object.assign({}, customer.addresses[0])
        ];
        delete customer.addresses;

        addresses[0].type = 'BILLING';
        addresses[1].type = 'SHIPPING';

        return getCartByCustomerEmail(yaas,
            config.emailaddress,
            config.siteCode,
            config.currency);
    })
    // when we found the cart, we need a stripe token
    .then(cart => {
        if (VERBOSE >= 1) console.log('cart:', cart);
        cartId = cart.cartId;
        return getToken(config.stripe);
    })
    // with the stripe token we can do the payment
    .then(stripeToken => {

        if (VERBOSE >= 1) console.log('stripe token:', stripeToken);

        var data = {
            payment: {
                paymentId: 'stripe',
                customAttributes: {
                    token: stripeToken
                }
            },
            cartId: cartId,
            customer: customer,
            addresses: addresses,
            currency: config.currency,
            siteCode: config.siteCode
        };

        if (VERBOSE >= 2) console.log('checkout data:', JSON.stringify(data, null, "    "));

        return yaas.checkout.checkout(data);
    })
    // ... then we're done with the checkout
    .then(response => {
        console.log('checkout response:', response);
    })
    .catch(error => {
        console.log('ERROR', error);

        if (error.body) {
            for (detail of error.body.details) {
                console.log('-', detail);
            }
        }
    });

// helper function to get the cart by customer id
function getCartByCustomerId(yaas, customerId, siteCode, currency) {
    // Get/create shopping cart
    return new Promise(function (resolve, reject) {
        var cart;

        yaas.cart.getByCriteria({
            customerId: customerId,
            siteCode: siteCode,
            currency: currency
        })
            .then(response => {
                cart = response.body;
                cart.cartId = cart.id; // Fixing API inconsistency
                resolve(cart);
            })
            .catch(response => {
                if (response.statusCode === 404) {
                    yaas.cart.create(customerId, currency, siteCode)
                        .then(response => resolve(response.body))
                        .catch(reject);
                } else {
                    reject(response);
                }
            });
    });
}

// helper function to get cart by email address
function getCartByCustomerEmail(yaas, customerEmail, siteCode, currency) {
    return yaas.customer.getCustomers({ q: 'contactEmail:"' + customerEmail + '"' })
        .then(response => getCartByCustomerId(yaas, response.body[0].customerNumber, siteCode, currency));
}

// helper function to get a stripe token
function getToken(stripeCredentials) {
    return new Promise(function (resolve, reject) {

        var required = [
            "stripe_secret",
            "credit_card_number",
            "credit_card_cvc",
            "credit_card_expiry_month",
            "credit_card_expiry_year"
        ];

        if (stripeCredentials.stripe_api_key.indexOf("sk") === 0) {
            console.log("*** WARNING: using a secret stripe api key. ***");
        }

        var stripe = require('stripe')(stripeCredentials.stripe_api_key);

        var card = {
            number: stripeCredentials.credit_card_number,
            exp_month: stripeCredentials.credit_card_expiry_month,
            exp_year: stripeCredentials.credit_card_expiry_year,
            cvc: stripeCredentials.credit_card_cvc
        };

        stripe.tokens.create({ card: card },
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token.id);
                }
            }
        );
    });
};
