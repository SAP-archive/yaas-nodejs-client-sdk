// require enviroment variables:
// TEST_YAAS_CLIENT_ID
// TEST_YAAS_CLIENT_SECRET
// TEST_YAAS_LOYALTY_PROGRAM_ID
// TEST_YAAS_LOYALTY_TIER_ID

var YaaS = require('../yaas.js');
var yaas = new YaaS();

describe('Loyalty', function () {

    describe('configuration', function () {
        var SCOPES = "";
        yaas.init(process.env.TEST_YAAS_CLIENT_ID, process.env.TEST_YAAS_CLIENT_SECRET, SCOPES); 
        it('should return a program configuration', function (done) {
            
            // we are not alone; need some time to connect to another server
            this.retries(5);
            this.timeout(3000);

            yaas.loyaltyConfiguration.getProgramConfigurations()
            .then(res => {
                res.body.should.not.be.empty();
                var conf = res.body[0];
                conf.should.have.property('loyaltyProgramName');
                conf.should.have.property('programId', process.env.TEST_YAAS_LOYALTY_PROGRAM_ID);
                conf.programTiers.should.not.be.empty();
                var programTiers = conf.programTiers[0];
                programTiers.should.have.property('tierId', process.env.TEST_YAAS_LOYALTY_TIER_ID);
                done();
            })
            .catch(err => done(err));
        })
    })

});