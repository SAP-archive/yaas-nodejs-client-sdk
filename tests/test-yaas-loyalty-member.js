var credentials = require('./yaas-credentials.json');
var scopes = "sap.loycore_manage";
var YaaS = require('../yaas.js');
var yaas = new YaaS();

	var crypto = require("crypto");

yaas.init(credentials.clientId, credentials.clientSecret, scopes);


var date = +new Date();
var member = 
{
    "memberId": crypto.randomBytes(16).toString("hex"),
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
            "tierId": "118a5133eb77466fb6e34b9db39dba40"
        }
    ],
    "totalEarnedPoints": 1000,
    "totalBalancePoints": 1000,
    "totalQualifyingPoints": 1000,
    "totalExpiredPoints": 0,
    "memberStatus": "ACTIVE",
    "customerId": "john_" + date,
    "programId": "1690297fe9ee446ca252021bb58e03e3",
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM"
};


function testCreateMember() {

	yaas.loyaltyMember.createMember(member)
	.then(res => console.log(JSON.stringify(res.body)))
	.catch(res => console.log(res));

}

function testGetMembers() {
	var params = {
		"fields" : "customerEmail"
		//"q" : "programId:1690297fe9ee446ca252021bb58e03e3"
	};

	yaas.loyaltyMember.getMembers(params)
	.then( res => console.log(JSON.stringify(res.body, null, "    ")))
	.catch(res => console.log(res));
}

function testGetMember(id) {
	id = id || "e06ce282ec5c0f9701ec03d10690b2af";
	return yaas.loyaltyMember.getMember(id);
	//.then( res => console.log(JSON.stringify(res.body, null, "    ")))
	//.catch(res => console.log(res));
}



function testUpdateMember() {
	var id = "e06ce282ec5c0f9701ec03d10690b2af"
	testGetMember(id)
	.then(res => {
		var patchedMember = res.body;

		patchedMember.customerPhone = "(555) 55 5555";
		yaas.loyaltyMember.updateMember(id, patchedMember)
		.then( res => console.log("aa", JSON.stringify(res.body)))
		.catch(res => console.log(res.body));
	});
}	



//testGetMember();
//testGetMembers();
//testCreateMember();
testUpdateMember();