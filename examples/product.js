// use require to load our configuration from test-config.json
var config = require('./test-config.json');

// we don't need any scopes here
var scopes = "";

// require our sdk
var YaaS = require('../yaas.js');

// create a new instance
var yaas = new YaaS();

// and fill it with credentials, scopes and tenant
yaas.init(config.credentials.clientId, config.credentials.clientSecret, scopes, config.tenant);

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
    .then(response => console.log(JSON.stringify(response.body, null, "    ")))
    .catch(errorResponse => console.log(errorResponse));
