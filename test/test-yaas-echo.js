'use strict';


describe('Echo', function () {
	describe('get token', function () {
		it('should return data for a new created token', function (done) {

			// create a new token
			var RequestHelper = require('../yaas-requesthelper.js');
			var requestHelper = new RequestHelper(process.env.TEST_YAAS_CLIENT_ID, process.env.TEST_YAAS_CLIENT_SECRET);

			requestHelper.getToken()
				.then(function (token) {

					var Echo = require('../yaas-echo.js');
					var echo = new Echo();
					echo.get(token)
						.then(function (body) { 		
							console.log('ECHO', body); 
						
							body.should.not.be.empty();

							// TODO test
							// hybris-client
							// hybris-client-id
					});
				});

		})
	})
});
