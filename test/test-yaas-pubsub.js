// require enviroment variables:
// TEST_YAAS_CLIENT_ID
// TEST_YAAS_CLIENT_SECRET
// TEST_YAAS_IDENTIFIER

var YaaS = require('../yaas.js');
var yaas = new YaaS();
var should = require('should');

var topicOwnerClient = process.env.TEST_YAAS_IDENTIFIER
var date = +new Date();
var eventType = "yaasjs_" + date;
var topic = topicOwnerClient + "." + eventType;
var payload = 'PAYLOAD';

var scopes = "hybris.pubsub.topic=" + topic;

yaas.init(process.env.TEST_YAAS_CLIENT_ID, process.env.TEST_YAAS_CLIENT_SECRET, scopes);


describe('PubSub', function () {

  describe('createTopic', function () {
    it('should create a topic without errors', function (done) {
        yaas.pubsub.createTopic(eventType)
        .then(res => {
				  done();
			  })
			  .catch(err => done(err));
    })

    it('should return 409 when same topic is created again', function (done) {
        yaas.pubsub.createTopic(eventType)
        .then(res => {
				  done('no error?');
			  })
			  .catch(err => {
          err.should.not.be.empty();
          err.statusCode.should.equal(409);
          done()
        });
    })
  })

  describe('publish', function () {
    it('should wait a bit before publishing something', function (done) {
      setTimeout(done, 800);
    });

    it('should publish a topic without errors', function (done) {
      yaas.pubsub.publish(topicOwnerClient, eventType, payload)
      .then(res => {
        done();
      })
      .catch(err => done(err));
    })
  })

  describe('read', function () {
    it('should read the payload', function (done) {
      yaas.pubsub.read(topicOwnerClient, eventType)
      .then(res => {
        res.should.not.be.empty();
        var event = res.events[0];
        event.should.have.a.property('eventType', eventType);
        event.should.have.a.property('payload', payload);
        done();
      })
      .catch(err => done(err));
    })

    it('should return a 404 for a wrong eventType', function (done) {
      yaas.pubsub.read(topicOwnerClient, 'WR0NG_3V3N77YP3')
      .then(res => {
        done('no error?');
      })
      .catch(err => {
        err.should.not.be.empty();
        err.statusCode.should.be.equal(404);
        done();
      });
    })

    it.skip('should return the same payload again', function (done) {
      // can take some time before re-reading is allowed
      this.retries(10);

      yaas.pubsub.read(topicOwnerClient, eventType, 1, true)
      .then(res => {
        res.should.not.be.empty();
        var event = res.events[0];
        event.should.have.a.property('eventType', eventType);
        event.should.have.a.property('payload', payload);
        done();
      })
      .catch(err => done(err));
    })

    it.skip('should return an empty payload after autocommit', function (done) {
      // can take some time before re-reading is allowed
      this.retries(10);

      yaas.pubsub.read(topicOwnerClient, eventType)
      .then(res => {
        should(res).be.undefined;
        done();
      })
      .catch(err => done(err));
    })

  })

  describe('commit', function () {
    it.skip('should commit', function (done) {
    })
  })  
});