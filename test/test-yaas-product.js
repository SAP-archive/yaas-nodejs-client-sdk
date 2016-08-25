// require enviroment variables:
// TEST_YAAS_CLIENT_ID
// TEST_YAAS_CLIENT_SECRET

var YaaS = require('../yaas.js');
var yaas = new YaaS();

var scopes = "";

yaas.init(process.env.TEST_YAAS_CLIENT_ID, process.env.TEST_YAAS_CLIENT_SECRET, scopes);

describe('Product', function () {
  describe('get details by sku', function () {
    it('should find a product', function (done) {

      var query = {
        "q" : { "sku": "yaasproduct1" }
      };

      yaas.product.getProducts(query)
      .then(res => {
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('sku', query.q.sku);
        done();
      })
      .catch(err => done(err));
    })

    it('should not find a product', function (done) {

      var query = {
        "q" : { "sku": "Pr0ductN0tD3f1n3d" }
      };

      yaas.product.getProducts(query)
      .then(res => {
        res.body.should.be.empty();
        done();
      })
      .catch(err => done(err));
    })
    
  })
})