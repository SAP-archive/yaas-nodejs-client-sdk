# yaas.js
## Node.js module for hybris as a Service (Yaas)

### Overview
This node.js module simplifys the access to the YaaS REST API. It handles authentication via OAuth2, replacement of expired tokens as well as automated retry of failed requests due to expired tokens. Knowledge of URLs is not necessary, every action has its own function. Currently only API calls that were needed for hybris labs prototypes are implemented.

### Requirements
This module makes use of JavaScript features that are still considered experimental (i.e. [Promises](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise)). You therefore need a more recent version of node.js that supports ECMAScript 6 (Harmony).

### Usage
Install the module via `npm`

	npm install git+ssh://git@enterprise-stash.hybris.com:7999/labs/yaas.js.git#v0.1.1 --save

or add

	"yaas.js": "git+ssh://git@enterprise-stash.hybris.com:7999/labs/yaas.js.git#v0.1.1"

to your `package.json`.

Include the module like this in your node.js code

	var yaas = require('yaas.js');

Then initialize the module

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

### Things to clarify
* General architecture
* Handling of HTTP status codes
* Structure of returned object used for *all* functions
* Better namespacing / avoid duplicate naming in function calls (e.g. yaas.cart.deleteCart() becomes yaas.cart.delete())
* Development principles (git-flow, branches, Pull Requests, unit tests, ...)
* Release on GitHub ([Outbound Open Source Process](https://jam4.sapjam.com/wiki/show/vb27mpl0YCRPfHD8rEs7fo?_lightbox=true))
* License (e.g. [MIT](http://choosealicense.com/licenses/mit/), [ISC](http://choosealicense.com/licenses/isc/))

### Release Notes

#### 0.1.1
* Auto-refreshed token was not saved

#### 0.1.0
* Initial version
