// require enviroment variables:
// TEST_YAAS_CLIENT_ID
// TEST_YAAS_CLIENT_SECRET
// TEST_YAAS_LOYALTY_PROGRAM_ID
// TEST_YAAS_LOYALTY_TIER_ID


var YaaS = require('../yaas.js');
var yaas = new YaaS();
var crypto = require("crypto");

var date = +new Date();
var memberId = crypto.randomBytes(16).toString("hex");
var foundMember;

var member = 
{
    "memberId": memberId,
    "memberNumber": "m1234567890",
    "customerFirstName": "John",
    "customerLastName": "Doe",
    "customerEmail": "john.doe@gmail.com",
    "customerPhone": "(650) 123-1234",
    "dateValidFrom": date,
    "dateValidTo": 2*date,
    "tierHistory": [
    	{
            "tierUpdateDate": date,
            "tierActivity": "UPGRADE",
            "tierId": process.env.TEST_YAAS_LOYALTY_TIER_ID
        }
    ],
    "totalEarnedPoints": 1000,
    "totalBalancePoints": 1000,
    "totalQualifyingPoints": 1000,
    "totalExpiredPoints": 0,
    "memberStatus": "ACTIVE",
    "customerId": "john_" + date,
    "programId": process.env.TEST_YAAS_LOYALTY_PROGRAM_ID,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM"
};

describe('Loyalty', function () {

	// we are not alone; need some time to connect to another server
	this.retries(5);
	this.timeout(3000);

    describe('member', function () {
        var SCOPES = "sap.loycore_manage";
        yaas.init(process.env.TEST_YAAS_CLIENT_ID, process.env.TEST_YAAS_CLIENT_SECRET, SCOPES); 
        it('should create a member', function (done) {
			yaas.loyaltyMember.createMember(member)
			.then(res => {
				console.log(JSON.stringify(res.body));
				done();
			})
			.catch(err => done(err));
		})

		it('should find a member', function (done) {
			var params = {
				"fields" : "customerEmail"
			};

			yaas.loyaltyMember.getMembers(params)
			.then( res => {
				res.body.should.not.be.empty();
				var member = res.body[0];
				member.should.have.property('customerEmail');
				done();
			})
			.catch(err => done(err));
		})

		it('should find a member by programm id', function (done) {
			var params = {
				"q" : "programId:" + process.env.TEST_YAAS_LOYALTY_PROGRAM_ID,
				"sort" : "dateValidTo:desc"
			};

			yaas.loyaltyMember.getMembers(params)
			.then( res => {
				res.body.should.not.be.empty();

				// set FOUND MEMBER
				foundMember = res.body[0];

				var member = res.body[0];
				member.should.have.property('customerEmail');
				done();
			})
			.catch(err => done(err));
		})

		it('should find a member by memberId', function (done) {
			// uses foundMember, if not set, error will be thrown
			var params = {
				"fields" : "customerEmail",
				"q" : "memberId:" + foundMember.memberId
			};

			yaas.loyaltyMember.getMembers(params)
			.then( res => {
				res.body.should.not.be.empty();
				var member = res.body[0];
				member.should.have.property('customerEmail');
				done();
			})
			.catch(err => done(err));
		})

		it('should not find a member', function (done) {
			var params = {
				"fields" : "customerEmail",
				"q" : "memberId:th15_15_n0t_4_m3mb3r1d"
			};

			yaas.loyaltyMember.getMembers(params)
			.then( res => {
				res.body.should.be.empty();
				done();
			})
			.catch(err => done(err));
		})

		// TODO skip
		it.skip('should update a member', function(done) {

			var id = foundMember.memberId;
			
			foundMember.customerPhone = "(555) 55 5555";
			yaas.loyaltyMember.updateMember(id, foundMember)
			.then( res => {
				console.log("aa", JSON.stringify(res.body));
			})
			.catch(err => done(err));
		})

	})

})
