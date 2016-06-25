var pathEchoBase = '/hybris/echo/v1';
// curl  https://api.yaas.io/hybris/echo/v1/get -H "Authorization:Bearer token"

var Echo = function(rh) {
    this.requestHelper = rh;

    this.get = function(token) {
        return this.requestHelper.get(pathEchoBase + '/get', 'application/json'
        ).then(function (response) {
            if (response.statusCode == 204) {
                return Promise.resolve();
            } else if (response.statusCode == 200) {
                return fixEventPayload(response.body.events).then(function() {
                    return Promise.resolve(response.body);
                });
            } else {
                console.log("Problem: " + JSON.stringify(response.body));
                return Promise.reject(new Error("Problem with request: " + JSON.stringify(response.body)));
            }
        });
    };

};

module.exports = Echo;
