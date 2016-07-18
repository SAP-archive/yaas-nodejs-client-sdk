var credentials = require('./yaas-credentials.json');
var scopes = "";
var YaaS = require('../yaas.js');
var yaas = new YaaS();

yaas.init(credentials.clientId, credentials.clientSecret, scopes);

yaas.loyaltyConfiguration.getProgramConfigurations()
.then(res => console.log(JSON.stringify(res.body)))
.catch(res => console.log(res));