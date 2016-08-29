'use strict';

var pathEchoBase = '/hybris/echo/v1';
var RequestHelper = require('./yaas-requesthelper.js');
var requestHelper = new RequestHelper();

var Echo = function() {

    this.get = function(token) {

	// curl  https://api.yaas.io/hybris/echo/v1/get -H "Authorization:Bearer $TOKEN"

        var headers = {};
	headers.Authorization = 'Bearer ' + token;

	var options = {
            hostname: requestHelper.yaasHost,
            port: 443,
            path: pathEchoBase + '/get',
            method: 'GET',
            headers: headers
        };

        return requestHelper.tryRequest(options);
    };

};

module.exports = Echo;
