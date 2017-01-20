// use require to load our configuration from test-config.json
var config = require('./test-config.json');

// define the topic and scopes
// for the topic we require the yaas identifier and an event type
// Note: we use always a different event type, 
//       otherwise createTopic will throw an error
var date = +new Date();
var eventType = "yaasjs_" + date;
var topic = config.identifier + "." + eventType;
var payload = 'PAYLOAD';
var scopes = "hybris.pubsub.topic=" + topic;

// require our sdk and create a new instance
var YaaS = require('../yaas.js');
var yaas = new YaaS();

// ... and fill it with credentials, scopes and tenant
yaas.init(config.credentials.clientId, config.credentials.clientSecret, scopes, config.tenant);

// now, we start the request and create an event type (yaasjs_<date>)
// we use Promise for that - they enable us to do some easy-to-read functional programming
yaas.pubsub.createTopic(eventType)
      .then(res => {
            // then we publish for this event type a payload 
            return yaas.pubsub.publish(config.identifier, eventType, 'PAYLOAD');
      })
      .then(res => {
            // we read the event type
            return yaas.pubsub.read(config.identifier, eventType);
      })
      .then(res => {
            // ... and print the result
            var event = res.events[0];
            console.log('pubsub event is', event);
      })
      .catch(err => {
            // here we catch all errors
            console.error(err);
      });