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
						.then(function (res) {
							res.should.not.be.empty();
							res.should.have.property('statusCode', 200);
							var body = res.body;
							body.should.have.property('hybris-client', process.env.TEST_YAAS_IDENTIFIER);
							body.should.have.property('hybris-client-id', process.env.TEST_YAAS_CLIENT_ID);
							done();
						});
				});
		})

		it('should return an error for an unknown token', function (done) {

			var Echo = require('../yaas-echo.js');
			var echo = new Echo();
			echo.get('unknown_token')
				.then(function (res) {
					res.should.not.be.empty();
					res.should.have.property('statusCode', 401);
					done();
				});
		})

	})
});
