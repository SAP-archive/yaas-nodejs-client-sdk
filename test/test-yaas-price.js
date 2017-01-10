'use strict';

// require enviroment variables:
// TEST_YAAS_CLIENT_ID
// TEST_YAAS_CLIENT_SECRET

var YaaS = require('../yaas.js');
var yaas = new YaaS();

var scopes = "";
var tenant = process.env.TEST_YAAS_IDENTIFIER.split('.')[0];

yaas.init(process.env.TEST_YAAS_CLIENT_ID, process.env.TEST_YAAS_CLIENT_SECRET, scopes, tenant);

var _productId;

describe('Price', function () {
  describe('get prices by code', function () {
    it('should find a price', function (done) {

      var query = {
        "q" : { "code": "yaasproduct1" }
      };

      yaas.price.getPrices(query, 'USD')
      .then(res => {
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        res.body[0].should.have.property('priceId');
        res.body[0].should.have.property('currency', 'USD');
        _productId = res.body[0].productId; //'57bda75e067833001dbeec30'
        done();
      })
      .catch(err => done(err));
    })
  })

  describe('get prices by product id', function () {
    it('should find a price', function (done) {
      
      var query = {
        "q" : { "code": "yaasproduct1" }
      };
      
      yaas.price.getPricesForProducts([_productId], 'USD')
      .then(res => {
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        res.body[0].should.have.property('priceId'); 
        res.body[0].should.have.property('currency', 'USD');
        done();
      })
      .catch(err => done(err));
    })
  })

});
