var https = require('https');
var querystring = require('querystring');

var RequestHelper = function(theClientId, theClientSecret, theScope, theProjectId) {
    /* Constants */
    this.yaasHost = 'api.yaas.io';
    this.oauthTokenPath = '/hybris/oauth2/v1/token';

    /* Variables */
    this.clientId = theClientId;
    this.clientSecret= theClientSecret;
    this.scope = theScope;
    this.projectId = theProjectId;
    this.debug = false;

    this.getToken = function() {
        if(this.accessToken) {
            return Promise.resolve(this.accessToken);
        }
        else {
            var options = {
                hostname: this.yaasHost,
                port: 443,
                path: this.oauthTokenPath,
                method: 'POST',
                headers: {'Content-Type' : 'application/x-www-form-urlencoded' }
            };
            var body = {
                'grant_type' : 'client_credentials',
                'scope' : this.scope,
                'client_id' : this.clientId,
                'client_secret' : this.clientSecret
            };
            return this.tryRequest(options, this.prepareData(body, 'application/x-www-form-urlencoded'))
            .then(function (response) {
                if (response.statusCode == 200) {
                    this.accessToken = response.body.access_token;
                    return Promise.resolve(this.accessToken);
                } else {
                    this.invalidateToken();
                    return Promise.reject(new Error("Could not obtain token!" + JSON.stringify(response.body)));
                }
            }.bind(this))
            .catch(function(e) {
                this.invalidateToken();
                return Promise.reject(e);
            }.bind(this));
        }
    };

    this.invalidateToken = function() {
        this.accessToken = undefined;
    };

    this.tryRequest = function(options, body) {
        return new Promise(function(resolve, reject) {
            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                var data = "";

                res.on('data', function (chunk) {
                    data += chunk;
                });

                res.on('end', function() {
                    this.processResponseBody({statusCode: res.statusCode, headers: res.headers, body: data})
                    .then(resolve)
                    .catch(reject);
                }.bind(this));
            }.bind(this));
        
            req.on('error', function(e) {
                reject(e);
            });

            if (body && (options.method == 'POST' || options.method == 'PUT')) {
                if (this.debug) { console.log("Sending data:", body); }
                req.write(body);
            }
            req.end();
        }.bind(this));
    };

    this.sendRequest = function(method, path, mime, data) {

        var headers = {};
        
        if (mime) {
            headers['Content-Type'] = mime;
        }

        path = this.preparePath(path);
        if (this.debug) { console.log(method, path); }
    
        var options = {
            hostname: this.yaasHost,
            port: 443,
            path: path,
            method: method,
            headers: headers
        };

        return new Promise(function (resolve, reject) {
            this.getToken()
            .then(function(token){
                options.headers.Authorization = 'Bearer ' + token;
                return this.tryRequest(options, data);
            }.bind(this))
            .then(function(response) {
                if(response.statusCode && response.statusCode == 401) {
                    this.invalidateToken();
                    this.getToken()
                    .then(function(token){
                        options.headers.Authorization = 'Bearer ' + token;
                        this.tryRequest(options, data)
                        .then(resolve)
                        .catch(reject);
                    }.bind(this))
                    .catch(reject);
                } else if (response.statusCode >= 400) {
                    reject(response);
                } else {
                    resolve(response);
                }
            }.bind(this))
            .catch(reject);
        }.bind(this));
    };

    this.delete = function(path) {
        return this.sendRequest('DELETE', path, null, {});
    };

    this.get = function(path, params) {
        var queryParamString = querystring.stringify(params);
        var pathWithParams = path + (queryParamString.length > 0 ? '?' + queryParamString : '');
        return this.sendRequest('GET', pathWithParams, null, {});
    };

    this.post = function(path, mime, postData) {
        return this.sendRequest('POST', path, mime, this.prepareData(postData, mime));
    };

    this.put = function(path, mime, putData) {
        return this.sendRequest('PUT', path, mime, this.prepareData(putData, mime));
    };

    this.prepareData = function(data, mime) {
      switch (mime) {
        case 'application/x-www-form-urlencoded':
          return querystring.stringify(data);
        case 'application/json':
          return JSON.stringify(data);
        default:
          return data;
      }
    };

    this.processResponseBody = function(response) {
      return new Promise(function(resolve, reject) {
        var responseMime;
        if (response.headers['content-type']) {
          responseMime = response.headers['content-type'].split(';')[0];
        }

        var responseBody;
        switch (responseMime) {
          case 'text/plain':
            responseBody = response.body;
            break;
          case 'application/json':
            try {
              responseBody = JSON.parse(response.body);
            } catch (e) {
              reject('Could not read server response: ' + e.message);
            }
            break;
          default:
            responseBody = response.body;
        }
        
        resolve({statusCode: response.statusCode, body: responseBody});
      });
    };

    this.preparePath = function(path) {
      return path.replace("{{projectId}}", this.projectId);
    };

    this.setDebug = function(state) {
      this.debug = state;
    };

};

module.exports = RequestHelper;
