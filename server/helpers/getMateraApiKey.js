(function () {
    "use strict";

    var secretKey = process.env.SECRET_KEY;
    var apiAccessKey = process.env.API_ACCESS_KEY;
    var url = "http://public-api-elb-1090807689.us-west-2.elb.amazonaws.com";
    var api = "/v1/accounts/";

    module.exports = function (crypto, request) {
        return {
            "generateHash": function (secret1, registration) {
                if (registration) {
                    return crypto.createHmac('sha256', secret1).update(registration).digest('hex');
                } else {
                    return crypto.createHmac('sha256', secret1).digest('hex');
                }
            },
            "getUserDetails": function (accountId) {
                var self = this;
                return new Promise(function (resolve, reject) {
                    request({
                        "url": url + api + accountId,
                        "method": "GET",
                        "headers": {
                            "Api-Access-Key": apiAccessKey,
                            "Transaction-Hash": self.generateHash(accountId)
                        }
                    }, function (error, response, body) {
                        if (!error) {
                            resolve(response);
                        } else {
                            reject(error);
                        }
                    });
                });
            }
        };
    };
}());
