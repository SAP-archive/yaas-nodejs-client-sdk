# YaaS.js

A Node.js client library for SAP Hybris as a Service (YaaS).

[![Build Status](https://travis-ci.org/SAP/yaas-nodejs-client-sdk.svg?branch=master)](https://travis-ci.org/SAP/yaas-nodejs-client-sdk)
[![Dependency status](https://img.shields.io/david/SAP/yaas-nodejs-client-sdk.svg)](https://david-dm.org/SAP/yaas-nodejs-client-sdk)
[![devDependencies Status](https://david-dm.org/SAP/yaas-nodejs-client-sdk/dev-status.svg)](https://david-dm.org/SAP/yaas-nodejs-client-sdk?type=dev)

## Overview

This Node.js module simplifies the access to the SAP Hybris as a Service (YaaS) REST APIs. It handles authentication via OAuth2 client credentials, replacement of expired tokens as well as automated retry of failed requests due to expired tokens. Knowledge of endpoint URLs by the developer is not required as all actions have their own functions. Currently only API calls that were needed for Hybris Labs prototypes are implemented. Contributions and pull requests are welcome.

## Requirements

* Node.js 4.x and later, supporting ECMAScript 6 features like Promises
* A YaaS account: <https://www.yaas.io/>
* A configured YaaS project and application, for required OAuth2 credentials

## Usage

Install the module via `npm`

    npm install yaas.js

Include the module like this in your node.js code

````javascript
var YaaS = require("yaas.js");
````

Then initialize the module

````javascript
var yaas = new YaaS();

yaas.init(
    'clientId',
    'clientSecret',
    'your scopes like hybris.myservice_view hybris.myservice_manage',
    'projectId',
    ['myservice'], // optional, array - allows you to load your own custom modules based on yaas.js
    'api.yaas.io' // optional - allows you to specify a custom api url (eg. yaas staging environment)
)
.then(function(response) {
    // init successful
}, function(reason) {
    // init not successful
});
````

On successful initialization your credentials seem valid and the module was able to obtain an authentication token.
You do not need to worry about this token, as it is handled internally and refreshed automatically.

The various YaaS services are used for namespacing like

````javascript
yaas.product.getProduct(theProductId)
yaas.cart.deleteCart(cartId)
...
````

Example of getting a set of documents:

````javascript
var reqParams = {
    pageNumber: 1,
    pageSize: 10,
    totalCount: true
};
yaas.document.getAll(clientApplicationId, documentType, reqParams).then(
    function(response) {
        console.log('Fetched', response.data.length, 'of', response.headers['hybris-count'], 'documents.');
    },
    function(err) {
        console.error('Error: ', err);
    }
);
````

## Documentation and examples

Blog posts:

* [… and the best part is, it’s open source!](http://labs.hybris.com/2016/07/20/best-part-open-source/)

### Localization

In order to receive content in a certain language (e.g. product names), you can use the method `setLanguage()` like this:

````javascript
yaas.setLanguage('en');
````

The set value will be sent as the Accept-Language header.
This method can be called anytime before and after `init()`, affecting all following API calls.
Setting a value of `undefined` (the default value) lets the called service decide which language(s) to return.
Please check the documentation of the respective service for default behavior.

## Things to improve

* More examples
* Handling of HTTP status codes
* Structure of returned object used for *all* functions
* Better namespacing / avoid duplicate naming in function calls (e.g. yaas.cart.deleteCart() becomes yaas.cart.delete())

## How to contact us

* Please email labs@hybris.com if you have questions or suggestions
