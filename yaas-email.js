'use strict';

var pathEmailBase = '/hybris/email/v2';

var Email = function (rh) {

    this.requestHelper = rh;

    function _genericEmailSender(endpoint, body) {
        return rh.post(
            `${pathEmailBase}/${endpoint}`,
            'application/json',
            body
        );
    };

    this.send = function (body) {
        _genericEmailSender("send", body);
    };

    this.sendSync = function (body) {
        _genericEmailSender("send-sync", body);
    };

};

module.exports = Email;