var pathPubSubBase = '/hybris/pubsub/v1/topics';

var PubSub = function(rh) {
    this.requestHelper = rh;

    this.commit = function(topicOwnerClient, eventType, token) {
        return this.requestHelper.post(
            pathPubSubBase + '/' + topicOwnerClient + '/' + eventType + '/commit',
            'application/json',
            {
                token: token
            }
        ).then(function (response) {
            if (response.statusCode == 200) {
                return Promise.resolve();
            } else {
                var errorMessage = "Problem: " + JSON.stringify(response.body);
                return Promise.reject(new Error(errorMessage));
            }
        });
    };

    this.read = function(topicOwnerClient, eventType, numEvents, autoCommit, ttlMs) {
        return this.requestHelper.post(
            pathPubSubBase + '/' + topicOwnerClient + '/' + eventType + '/read',
            'application/json',
            {
                numEvents: numEvents,
                ttlMs: ttlMs || 4000,
                autoCommit: autoCommit || false
            }
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

    this.publish = function(topicOwnerClient, eventType, payload) {
        return this.requestHelper.post(
            pathPubSubBase + '/' + topicOwnerClient + '/' + eventType + '/publish',
            'application/json',
            {
                payload: JSON.stringify(payload)
            }
        ).then(function (response) {
            if (response.statusCode == 201) {
                return Promise.resolve();
            } else {
                console.log("Problem: " + JSON.stringify(response.body));
                return Promise.reject(new Error("Problem with request: " + JSON.stringify(response.body)));
            }
        });
    };

    this.createTopic = function(eventType) {
        return this.requestHelper.post(
            pathPubSubBase,
            'application/json',
            {
                eventType: eventType
            }
        ).then(function (response) {
            if (response.statusCode == 201) {
                return Promise.resolve();
            } else {
                console.log("Problem: " + JSON.stringify(response.body));
                return Promise.reject(new Error("Problem with request: " + JSON.stringify(response.body)));
            }
        });
    };
};

/**
 * Convert PubSub event payloads into proper nested JSON
 */
function fixEventPayload(events) {
    return new Promise(function (resolve, reject) {
        events.forEach(function(event) {
            try {
                event.payload = JSON.parse(event.payload);
            } catch (e) {
                console.log("Could not parse payload");
                return reject(new Error("Could not parse payload: " + e.message));
            }
        });
        resolve();
    });
}

module.exports = PubSub;
