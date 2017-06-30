// use require to load our configuration from test-config.json
var config = require('./test-config.json');

// we don't need any scopes here
var scopes = "";

// require our sdk
var YaaS = require('../yaas.js');

// create a new instance
var yaas = new YaaS();

// and fill it with credentials, scopes and tenant
yaas.init(config.credentials.clientId, config.credentials.clientSecret,
    //scopes, 
    'hybris.customer_read hybris.cart_manage',
    config.tenant);

// now we can build an object that includes query parameter
// we put the code (or product number) of our product here
// in the end, this will be reformatted to a string included in the url
var query = {
    q: {
        code: config.productNumber
    }
};

// now, we start the request
// we use Promise for that - they enable us to do some easy-to-read functional programming

yaas.product.getProducts(query)
    .then(response => {
        // store the product
        this.product = response.body[0];
    })

    // get the cart by the customer email
    .then(() => getCartByCustomerEmail(yaas,
        config.emailaddress,
        config.siteCode,
        config.currency))
    .then(response => {
        // store the cart id
        this.cartId = response.cartId;
        // get the price for our product
        return yaas.price.getPricesForProducts([this.product.id], config.currency)
    })
    .then(p_response => {
        // set product price
        this.product.price = p_response.body[0];
        var quantity = 1;

        console.log('PRODUCT NAME', this.product.name);

        // map product name
        if (this.product.name && this.product.name.en) {
            this.product.name = this.product.name.en;
        }
        // map product description
        if (this.product.description && this.product.description.en) {
            this.product.description = this.product.description.en;
        }
        // add the product to the cart id
        return yaas.cart.addProduct(this.cartId, this.product, quantity, this.product.price)
    })
    .then(cart => {
        // log the result (should be a 201)
        console.log('CART', cart);
    })
    .catch(e => {
        console.log(e);
        if (e.body && e.body.details) console.log('DETAILS:', e.body.details[0]);
    });


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

function getCartByCustomerEmail(yaas, customerEmail, siteCode, currency) {
    return yaas.customer.getCustomers({ q: 'contactEmail:"' + customerEmail + '"' })
        .then(response => getCartByCustomerId(yaas, response.body[0].customerNumber, siteCode, currency));
}
