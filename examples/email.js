// use require to load our configuration from test-config.json
var config = require('./test-config.json');

// set scopes here
var scopes = "hybris.email_send";

// require our sdk
var YaaS = require('../yaas.js');

// create a new instance
var yaas = new YaaS();

// and fill it with credentials, scopes and tenant
yaas.init(config.credentials.clientId, config.credentials.clientSecret, scopes, config.tenant);

// fill the email body
var body = {
    "toAddress": config.emailaddress,
    "toName": "Yaasjs Example",
    "fromAddress": "noreply@" + config.tenant + ".mail.yaas.io",
    "fromName": "Chuck Norris",
    "subject": "Yaas.js example email",
    "body": "This is the email content. @" + (Date.now())
}

// now, we send the email (in a queue)
// we use Promise for that - they enable us to do some easy-to-read functional programming
yaas.email.send(body)
    .then(response => console.log(JSON.stringify(response.body, null, "    ")))
    .catch(errorResponse => console.log("send", errorResponse));

// now, we send the email (sync)
body.body += " SYNC";
yaas.email.sendSync(body)
    .then(response => console.log(JSON.stringify(response.body, null, "    ")))
    .catch(errorResponse => console.log("sendSync", errorResponse));
