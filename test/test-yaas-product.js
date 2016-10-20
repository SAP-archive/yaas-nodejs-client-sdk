'use strict';

// require enviroment variables:
// TEST_YAAS_CLIENT_ID
// TEST_YAAS_CLIENT_SECRET

var YaaS = require('../yaas.js');
var yaas = new YaaS();

var scopes = "";

yaas.init(process.env.TEST_YAAS_CLIENT_ID, process.env.TEST_YAAS_CLIENT_SECRET, scopes);

describe('Product', function () {
  describe('get details by code', function () {
    it('should find a product', function (done) {

      var query = {
        "q" : { "code": "yaasproduct1" }
      };

      yaas.product.getProducts(query)
      .then(res => {
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('code', query.q.code);
        done();
      })
      .catch(err => done(err));
    })

    it('should not find a product', function (done) {

      var query = {
        "q" : { "code": "Pr0ductN0tD3f1n3d" }
      };

      yaas.product.getProducts(query)
      .then(res => {
        res.body.should.be.empty();
        done();
      })
      .catch(err => done(err));
    })
    
  })

    describe('check localization', function () {
        it('should return a map with different languages', function (done) {
            var query = {
                "q" : { "code": "yaasproduct1" }
            };

            yaas.product.getProducts(query)
                .then(res => {
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                    res.body[0].should.have.property('name');
                    res.body[0].name.should.be.instanceof(Object);
                    res.body[0].name.should.have.property('de');
                    res.body[0].name.should.have.property('en');
                    done();
                })
        });

        it('should return all languages when explicitly none is specified', function (done) {
            var query = {
                "q" : { "code": "yaasproduct1" }
            };

            yaas.setLanguage('');
            yaas.product.getProducts(query)
                .then(res => {
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                    res.body[0].should.have.property('name');
                    res.body[0].name.should.be.instanceof(Object);
                    res.body[0].name.should.have.property('de');
                    res.body[0].name.should.have.property('en');
                    done();
                })
        });

        it('should return product name in german', function (done) {
            var query = {
                "q" : { "code": "yaasproduct1" }
            };

            yaas.setLanguage('de');
            yaas.product.getProducts(query)
                .then(res => {
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                    res.body[0].should.have.property('name');
                    res.body[0].name.should.be.exactly('YaaS Produkt 1');
                    done();
                })
        });

        it('should return product name in english', function (done) {
            var query = {
                "q" : { "code": "yaasproduct1" }
            };

            yaas.setLanguage('en');
            yaas.product.getProducts(query)
                .then(res => {
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                    res.body[0].should.have.property('name');
                    res.body[0].name.should.be.exactly('YaaS product 1');
                    done();
                })
        });
    })
});