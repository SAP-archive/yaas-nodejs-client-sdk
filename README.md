# YaaS.js, a SAP Hybris as a Service (YaaS) client library for Node.js

## Overview
This Node.js module simplifies the access to the SAP Hybris as a Service (YaaS) REST APIs. It handles authentication via OAuth2 client credentials, replacement of expired tokens as well as automated retry of failed requests due to expired tokens. Knowledge of endpoint URLs by the developer is not required as all actions have their own functions. Currently only API calls that were needed for Hybris Labs prototypes are implemented. Contributions and pull requrests are welcome.

## Requirements
* Node.js 4.x and later, supporting ECMAScript 6 features like Promises
* A YaaS account: https://www.yaas.io/
* A configured YaaS project and application, for required OAuth2 credentials

## Usage
Install the module via `npm`

	npm install git+ssh://git@enterprise-stash.hybris.com:7999/labs/yaas.js.git#v0.1.1 --save

Include the module like this in your node.js code

  var YaaS = require("yaas.js");

Then initialize the module

  var yaas = new YaaS();

	yaas.init(clientId, clientSecret, scopes, projectId)
	.then(function(response) {
		// init successful
	}, function(reason) {
		// init not successful
	});

On successful initialization your credentials seem valid and the module was able to obtain an authentication token.
You do not need to worry about this token, as it is handled internally and refreshed automatically.

The various CaaS services are used for namespacing like

	yaas.product.getProduct(theProductId)
	yaas.cart.deleteCart(cartId)
	...

## Things to improve
* More examples
* Handling of HTTP status codes
* Structure of returned object used for *all* functions
* Better namespacing / avoid duplicate naming in function calls (e.g. yaas.cart.deleteCart() becomes yaas.cart.delete())

