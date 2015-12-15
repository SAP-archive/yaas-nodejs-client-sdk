var pathPubSubBase = '/hybris/pubsub/v1/topics';

var requestHelper;

function init(rh) {
	requestHelper = rh;
}

function commit(topicOwnerClient, eventType, token) {
	return requestHelper.post(
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
}

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

function read(topicOwnerClient, eventType, numEvents) {
	return requestHelper.post(
		pathPubSubBase + '/' + topicOwnerClient + '/' + eventType + '/read',
		'application/json',
		{
			numEvents: numEvents,
			ttlMs: 4000,
			autoCommit: false
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
}

module.exports = {
	commit: commit,
	init: init,
	read: read
}